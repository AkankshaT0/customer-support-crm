import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock3,
  Layers3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboard } from "../services/api";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { PriorityBadge, StatusBadge } from "../components/Badge";

export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => {
    getDashboard().then((r) => setD(r.data));
  }, []);
  if (!d) return <div className="loading-state">Loading dashboard…</div>;
  const priorityData = d.byPriority.map((x) => ({
    name: x._id,
    value: x.count,
  }));
  const categoryData = d.byCategory.map((x) => ({
    name: x._id,
    value: x.count,
  }));
  return (
    <div className="page-stack">
      <section className="hero-row">
        <div>
          <h2>
            Support health <span>live</span>
          </h2>
          <p>A compact view of workload, SLA risk and recent activity.</p>
        </div>
        <div className="live-pill">
          <i /> Live data
        </div>
      </section>
      <div className="stats-grid">
        <StatCard
          label="Total tickets"
          value={d.metrics.total}
          hint="All requests"
          icon={Layers3}
        />
        <StatCard
          label="Open"
          value={d.metrics.open}
          hint="Waiting for action"
          icon={CircleDot}
          accent="peach"
        />
        <StatCard
          label="In progress"
          value={d.metrics.progress}
          hint="Being worked"
          icon={Clock3}
          accent="gold"
        />
        <StatCard
          label="SLA overdue"
          value={d.metrics.overdue}
          hint="Needs attention"
          icon={AlertTriangle}
          accent="red"
        />
      </div>
      <div className="chart-grid">
        <section className="panel chart-panel">
          <div className="panel-title">
            <div>
              <h3>Tickets by priority</h3>
              <p>Current workload distribution</p>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={priorityData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#E8A07C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-title">
            <div>
              <h3>Tickets by category</h3>
              <p>Where customers need help</p>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {categoryData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        [
                          "#E8A07C",
                          "#D78362",
                          "#F2C3A7",
                          "#A75D44",
                          "#7E6B60",
                          "#D9A441",
                        ][i % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="category-legend">
            {categoryData.slice(0, 4).map((x) => (
              <span key={x.name}>
                <i />
                {x.name} <b>{x.value}</b>
              </span>
            ))}
          </div>
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-title">
          <div>
            <h3>Recent tickets</h3>
            <p>Latest requests entering the queue</p>
          </div>
          <Link to="/" className="text-link">
            View all →
          </Link>
        </div>
        <div className="recent-list">
          {d.recent.map((t) => (
            <Link
              to={`/tickets/${t.ticket_id}`}
              className="recent-item"
              key={t.ticket_id}
            >
              <div>
                <strong>{t.subject}</strong>
                <span>
                  {t.ticket_id} · {t.customer_name}
                </span>
              </div>
              <div>
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
