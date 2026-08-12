export default function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`badge badge-${tone.toLowerCase().replace(/\s+/g, "-")}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  return <Badge tone={status}>{status}</Badge>;
}
export function PriorityBadge({ priority }) {
  return <Badge tone={priority}>{priority}</Badge>;
}
