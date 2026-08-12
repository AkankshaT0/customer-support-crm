import express from "express";
import Ticket from "../models/Ticket.js";
import Note from "../models/Note.js";
import { getSlaDueAt, nextTicketId, isOverdue } from "../utils.js";

const router = express.Router();
const STATUSES = ["Open", "In Progress", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

async function generateTicketId() {
  const latest = await Ticket.findOne()
    .sort({ created_at: -1 })
    .select("ticket_id");
  return nextTicketId(latest);
}

router.post("/", async (req, res, next) => {
  try {
    const {
      customer_name,
      customer_email,
      order_id = "",
      subject,
      description,
      priority = "Medium",
      category = "General",
      channel = "Web",
      assignee = "Unassigned",
      tags = [],
    } = req.body;
    if (!customer_name || !customer_email || !subject || !description)
      return res
        .status(400)
        .json({
          success: false,
          message:
            "customer_name, customer_email, subject and description are required.",
        });
    const ticket_id = await generateTicketId();
    const created = new Date();
    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      order_id,
      subject,
      description,
      priority,
      category,
      channel,
      assignee,
      tags,
      sla_due_at: getSlaDueAt(priority, created),
      activity: [
        { type: "created", message: "Ticket created" },
        { type: "triage", message: `Initial priority set to ${priority}` },
      ],
    });
    res
      .status(201)
      .json({
        ticket_id: ticket.ticket_id,
        created_at: ticket.created_at,
        ticket,
      });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assignee,
      category,
      search = "",
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};
    if (status && STATUSES.includes(status)) query.status = status;
    if (priority && PRIORITIES.includes(priority)) query.priority = priority;
    if (assignee) query.assignee = assignee;
    if (category) query.category = category;
    if (search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      query.$or = [
        { ticket_id: regex },
        { customer_name: regex },
        { customer_email: regex },
        { subject: regex },
        { description: regex },
      ];
    }
    const skip = (Math.max(1, Number(page)) - 1) * Math.min(100, Number(limit));
    const take = Math.min(100, Math.max(1, Number(limit)));
    const [tickets, total] = await Promise.all([
      Ticket.find(query).sort({ updated_at: -1 }).skip(skip).limit(take).lean(),
      Ticket.countDocuments(query),
    ]);
    res.json({
      tickets,
      total,
      page: Number(page),
      pages: Math.ceil(total / take),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const [
      total,
      open,
      progress,
      closed,
      overdue,
      byPriority,
      byCategory,
      recent,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
      Ticket.countDocuments({ status: "In Progress" }),
      Ticket.countDocuments({ status: "Closed" }),
      Ticket.countDocuments({
        status: { $ne: "Closed" },
        sla_due_at: { $lt: new Date() },
      }),
      Ticket.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Ticket.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Ticket.find()
        .sort({ created_at: -1 })
        .limit(6)
        .select("ticket_id subject status priority customer_name created_at")
        .lean(),
    ]);
    res.json({
      metrics: { total, open, progress, closed, overdue },
      byPriority,
      byCategory,
      recent,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/export/csv", async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ created_at: -1 }).lean();
    const headers = [
      "ticket_id",
      "customer_name",
      "customer_email",
      "order_id",
      "subject",
      "status",
      "priority",
      "category",
      "channel",
      "assignee",
      "created_at",
      "sla_due_at",
    ];
    const esc = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...tickets.map((t) => headers.map((h) => esc(t[h])).join(",")),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="supportflow-tickets.csv"',
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.get("/:ticket_id", async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticket_id,
    }).lean();
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    const notes = await Note.find({ ticket_id: ticket.ticket_id })
      .sort({ created_at: -1 })
      .lean();
    res.json({ ...ticket, notes, overdue: isOverdue(ticket) });
  } catch (err) {
    next(err);
  }
});

router.put("/:ticket_id", async (req, res, next) => {
  try {
    const { status, notes, priority, assignee, category, tags } = req.body;
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    const activity = [];
    if (status && status !== ticket.status) {
      if (!STATUSES.includes(status))
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      ticket.status = status;
      activity.push({ type: "status", message: `Status changed to ${status}` });
      if (status === "Closed") ticket.resolved_at = new Date();
      if (status === "In Progress" && !ticket.first_response_at)
        ticket.first_response_at = new Date();
    }
    if (priority && priority !== ticket.priority) {
      if (!PRIORITIES.includes(priority))
        return res
          .status(400)
          .json({ success: false, message: "Invalid priority" });
      ticket.priority = priority;
      ticket.sla_due_at = getSlaDueAt(priority, ticket.created_at);
      activity.push({
        type: "priority",
        message: `Priority changed to ${priority}`,
      });
    }
    if (assignee !== undefined && assignee !== ticket.assignee) {
      ticket.assignee = assignee || "Unassigned";
      activity.push({
        type: "assignment",
        message: `Assigned to ${ticket.assignee}`,
      });
    }
    if (category) ticket.category = category;
    if (Array.isArray(tags)) ticket.tags = tags;
    if (notes?.trim()) {
      await Note.create({
        ticket_id: ticket.ticket_id,
        note_text: notes.trim(),
      });
      activity.push({ type: "note", message: "Internal note added" });
    }
    ticket.activity.push(...activity);
    await ticket.save();
    res.json({ success: true, updated_at: ticket.updated_at, ticket });
  } catch (err) {
    next(err);
  }
});

export default router;
