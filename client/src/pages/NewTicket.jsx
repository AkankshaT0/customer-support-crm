import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { createTicket } from "../services/api";
import { PRIORITIES, CATEGORIES, CHANNELS, AGENTS } from "../utils/constants";

const initial = {
  customer_name: "",
  customer_email: "",
  order_id: "",
  subject: "",
  description: "",
  priority: "Medium",
  category: "General",
  channel: "Web",
  assignee: "Unassigned",
  tags: "",
};
export default function NewTicket() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const update = (k, v) => setForm({ ...form, [k]: v });
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await createTicket({
        ...form,
        tags: form.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      });
      nav(`/tickets/${data.ticket_id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create ticket.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="form-page">
      <button className="back-link" onClick={() => nav("/")}>
        <ArrowLeft size={16} /> Back to inbox
      </button>
      <div className="form-grid">
        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NEW REQUEST</p>
              <h2>Create ticket</h2>
              <p>
                Capture enough context for the next agent to act without asking
                the customer twice.
              </p>
            </div>
            <div className="smart-pill">
              <Sparkles size={15} /> Smart triage ready
            </div>
          </div>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-section">
              <h3>Customer details</h3>
              <div className="two-col">
                <label>
                  Customer name
                  <input
                    required
                    value={form.customer_name}
                    onChange={(e) => update("customer_name", e.target.value)}
                    placeholder="e.g. Riya Sharma"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => update("customer_email", e.target.value)}
                    placeholder="riya@example.com"
                  />
                </label>
                <label>
                  Order ID <span className="optional">optional</span>
                  <input
                    value={form.order_id}
                    onChange={(e) => update("order_id", e.target.value)}
                    placeholder="e.g. ORD-10492"
                  />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3>Issue</h3>
              <label>
                Subject
                <input
                  required
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Short description of the issue"
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  rows="7"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="What happened? Include relevant order IDs, error messages, or context…"
                />
              </label>
            </div>
            <div className="form-section">
              <h3>Routing</h3>
              <div className="two-col">
                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(e) => update("priority", e.target.value)}
                  >
                    {PRIORITIES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {CATEGORIES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Channel
                  <select
                    value={form.channel}
                    onChange={(e) => update("channel", e.target.value)}
                  >
                    {CHANNELS.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Assignee
                  <select
                    value={form.assignee}
                    onChange={(e) => update("assignee", e.target.value)}
                  >
                    {AGENTS.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Tags <span className="optional">comma separated</span>
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="refund, vip, mobile"
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => nav("/")}
              >
                Cancel
              </button>
              <button disabled={saving} className="primary-button">
                {saving ? (
                  "Creating…"
                ) : (
                  <>
                    <Send size={17} /> Create ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
        <aside className="side-tip">
          <div className="tip-icon">
            <Sparkles />
          </div>
          <h3>Designed for fast resolution</h3>
          <p>
            Every ticket gets an SLA deadline based on priority. Agents can
            later update ownership, status, notes and tags from the ticket
            workspace.
          </p>
          <div className="tip-list">
            <span>✓ Auto-generated ticket ID</span>
            <span>✓ SLA tracking</span>
            <span>✓ AI triage</span>
            <span>✓ Activity timeline</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
