import { ArrowUpRight } from "lucide-react";
export default function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-head">
        <span>{label}</span>
        <div className={`stat-icon ${accent || ""}`}>
          <Icon size={18} />
        </div>
      </div>
      <strong>{value}</strong>
      <p>
        {hint}
        <ArrowUpRight size={13} />
      </p>
    </div>
  );
}
