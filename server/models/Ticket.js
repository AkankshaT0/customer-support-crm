import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: { type: String, unique: true, index: true },
    customer_name: { type: String, required: true, trim: true },
    customer_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    order_id: { type: String, trim: true, default: "" },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
      index: true,
    },
    category: {
      type: String,
      enum: ["General", "Billing", "Technical", "Account", "Order", "Bug"],
      default: "General",
    },
    channel: {
      type: String,
      enum: ["Email", "Web", "Chat", "Phone"],
      default: "Web",
    },
    assignee: { type: String, default: "Unassigned", trim: true },
    tags: [{ type: String, trim: true }],
    sla_due_at: { type: Date },
    first_response_at: { type: Date },
    resolved_at: { type: Date },
    activity: [
      {
        type: {
          type: String,
          enum: [
            "created",
            "status",
            "priority",
            "assignment",
            "note",
            "triage",
          ],
        },
        message: String,
        created_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

ticketSchema.index({
  customer_name: "text",
  customer_email: "text",
  subject: "text",
  description: "text",
  ticket_id: "text",
});

export default mongoose.model("Ticket", ticketSchema);
