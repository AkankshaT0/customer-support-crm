import { Link } from "react-router-dom";
import { ChevronRight, Clock3 } from "lucide-react";
import { PriorityBadge, StatusBadge } from "./Badge";

export default function TicketTable({ tickets, loading }) {
  if (loading) return <div className="table-empty">Loading tickets…</div>;
  if (!tickets.length)
    return (
      <div className="table-empty">
        <div className="empty-illustration">◎</div>
        <strong>No tickets found</strong>
        <span>Try changing your search or filters.</span>
      </div>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id}>
              <td>
                <Link className="ticket-link" to={`/tickets/${t.ticket_id}`}>
                  {t.ticket_id}
                </Link>
              </td>
              <td>
                <div className="customer">
                  <div className="mini-avatar">
                    {t.customer_name?.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <strong>{t.customer_name}</strong>
                    <span>{t.customer_email}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="subject-cell">
                  <strong>{t.subject}</strong>
                  <span>
                    {t.category} · {t.channel}
                  </span>
                </div>
              </td>
              <td>
                <StatusBadge status={t.status} />
              </td>
              <td>
                <PriorityBadge priority={t.priority} />
              </td>
              <td>
                <div className="date-cell">
                  <Clock3 size={13} />
                  {new Date(t.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </td>
              <td>
                <Link className="row-arrow" to={`/tickets/${t.ticket_id}`}>
                  <ChevronRight size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
