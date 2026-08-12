import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Save,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { getTicket, updateTicket, triageTicket } from "../services/api";
import { AGENTS, CATEGORIES, PRIORITIES, STATUS } from "../utils/constants";
import { PriorityBadge, StatusBadge } from "../components/Badge";

export default function TicketDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [ai, setAi] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getTicket(id);
      setTicket(data);
    } catch (e) {
      setError(e.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [id]);
  const save = async (patch) => {
    setSaving(true);
    try {
      const { data } = await updateTicket(id, patch);
      setTicket({ ...ticket, ...data.ticket });
      setNote("");
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };
  const runAi = async () => {
    setAiLoading(true);
    try {
      const { data } = await triageTicket(id);
      setAi(data);
    } finally {
      setAiLoading(false);
    }
  };
  if (loading) return <div className="loading-state">Loading ticket…</div>;
  if (!ticket) return <div className="error-box">{error}</div>;
  const due = new Date(ticket.sla_due_at);
  const overdue = ticket.overdue;
  return (
    <div className="page-stack detail-page">
      <button className="back-link" onClick={() => nav("/")}>
        <ArrowLeft size={16} /> Back to inbox
      </button>
      {error && <div className="error-box">{error}</div>}
      <div className="detail-grid">
        <main className="panel ticket-main">
          <div className="ticket-header">
            <div>
              <div className="ticket-id">
                {ticket.ticket_id} <span>·</span> created{" "}
                {new Date(ticket.created_at).toLocaleString()}
              </div>
              <h2>{ticket.subject}</h2>
              <div className="ticket-badges">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="plain-badge">{ticket.category}</span>
                <span className="plain-badge">{ticket.channel}</span>
              </div>
            </div>
            <button className="ghost-button" onClick={runAi}>
              <Sparkles size={16} />
              {aiLoading ? "Thinking…" : "Smart triage"}
            </button>
          </div>
          <div className="customer-strip">
            <div className="customer-big-avatar">
              {ticket.customer_name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{ticket.customer_name}</strong>
              <span>
                <Mail size={13} />
                {ticket.customer_email}
              </span>
            </div>
            <div className="customer-meta">
              <span>Order</span>
              <strong>{ticket.order_id || "—"}</strong>
            </div>
            <div className="customer-meta">
              <span>Assignee</span>
              <strong>{ticket.assignee}</strong>
            </div>
            <div className="customer-meta">
              <span>SLA</span>
              <strong className={overdue ? "danger-text" : ""}>
                {overdue
                  ? "Overdue"
                  : due.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
              </strong>
            </div>
          </div>
          {ai && (
            <div className="ai-result">
              <div className="ai-result-head">
                <WandSparkles size={17} />
                <strong>Smart triage suggestion</strong>
                <span>
                  {ai.source === "openai" ? "AI model" : "Local fallback"}
                </span>
              </div>
              <div className="ai-grid">
                <div>
                  <small>Category</small>
                  <strong>{ai.category}</strong>
                </div>
                <div>
                  <small>Priority</small>
                  <strong>{ai.priority}</strong>
                </div>
                <div className="reply">
                  <small>Suggested reply</small>
                  <p>{ai.suggested_reply}</p>
                </div>
              </div>
              <div className="ai-actions">
                <button
                  className="ghost-button"
                  onClick={() =>
                    save({ category: ai.category, priority: ai.priority })
                  }
                >
                  Apply triage
                </button>
              </div>
            </div>
          )}
          <div className="description-block">
            <div className="block-title">
              <MessageSquare size={16} /> Customer description
            </div>
            <p>{ticket.description}</p>
          </div>
          <div className="timeline">
            <div className="block-title">
              <Clock3 size={16} /> Activity
            </div>
            {[...(ticket.activity || [])].reverse().map((a, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div>
                  <strong>{a.message}</strong>
                  <span>{new Date(a.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="notes-section">
            <div className="block-title">
              <MessageSquare size={16} /> Internal notes
            </div>
            {ticket.notes?.map((n) => (
              <div className="note" key={n._id}>
                <div className="note-avatar">{n.author.slice(0, 1)}</div>
                <div>
                  <strong>{n.author}</strong>
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                  <p>{n.note_text}</p>
                </div>
              </div>
            ))}
            <div className="note-compose">
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note for the support team…"
              />
              <button
                disabled={!note.trim() || saving}
                className="primary-button"
                onClick={() => save({ notes: note })}
              >
                <Save size={16} /> Add note
              </button>
            </div>
          </div>
        </main>
        <aside className="detail-side">
          <section className="panel side-panel">
            <h3>Update ticket</h3>
            <label>
              Status
              <select
                value={ticket.status}
                onChange={(e) => save({ status: e.target.value })}
              >
                {STATUS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select
                value={ticket.priority}
                onChange={(e) => save({ priority: e.target.value })}
              >
                {PRIORITIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Assignee
              <select
                value={ticket.assignee}
                onChange={(e) => save({ assignee: e.target.value })}
              >
                {AGENTS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select
                value={ticket.category}
                onChange={(e) => save({ category: e.target.value })}
              >
                {CATEGORIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </section>
          <section className="panel sla-panel">
            <div className="sla-icon">
              <CalendarClock size={18} />
            </div>
            <div>
              <span>SLA deadline</span>
              <strong className={overdue ? "danger-text" : ""}>
                {due.toLocaleString()}
              </strong>
              <p>
                {overdue
                  ? "This ticket needs attention."
                  : "Deadline calculated from priority."}
              </p>
            </div>
          </section>
          <section className="panel checklist-panel">
            <h3>Resolution checklist</h3>
            <div>
              <CheckCircle2 size={16} />
              <span>Customer details captured</span>
            </div>
            <div>
              <CheckCircle2 size={16} />
              <span>Issue context documented</span>
            </div>
            <div className={ticket.first_response_at ? "done" : ""}>
              <CheckCircle2 size={16} />
              <span>First response recorded</span>
            </div>
            <div className={ticket.resolved_at ? "done" : ""}>
              <CheckCircle2 size={16} />
              <span>Resolution completed</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
