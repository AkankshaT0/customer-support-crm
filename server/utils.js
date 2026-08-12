export function calculateSlaHours(priority) {
  return { Urgent: 4, High: 12, Medium: 24, Low: 48 }[priority] || 24;
}

export function getSlaDueAt(priority, from = new Date()) {
  return new Date(
    from.getTime() + calculateSlaHours(priority) * 60 * 60 * 1000,
  );
}

export function nextTicketId(latest) {
  const n = latest ? Number(latest.ticket_id.replace("TKT-", "")) + 1 : 1;
  return `TKT-${String(n).padStart(4, "0")}`;
}

export function isOverdue(ticket) {
  return (
    ticket.status !== "Closed" &&
    ticket.sla_due_at &&
    new Date(ticket.sla_due_at) < new Date()
  );
}
