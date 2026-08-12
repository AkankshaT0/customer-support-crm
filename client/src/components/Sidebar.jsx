import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Inbox,
  Plus,
  Download,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import { getExportUrl } from "../services/api";

export default function Sidebar() {
  const link = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <LifeBuoy size={22} />
        </div>
        <div>
          <strong>SupportFlow</strong>
          <span>Customer CRM</span>
        </div>
      </div>
      <div className="nav-section">
        <span>WORKSPACE</span>
        <NavLink to="/" className={link}>
          <Inbox size={18} /> All Tickets
        </NavLink>
        <NavLink to="/dashboard" className={link}>
          <BarChart3 size={18} /> Dashboard
        </NavLink>
        <NavLink to="/new" className={link}>
          <Plus size={18} /> New Ticket
        </NavLink>
      </div>
      <div className="nav-section">
        <span>TOOLS</span>
        <a className="nav-link" href={getExportUrl()}>
          <Download size={18} /> Export CSV
        </a>
        <div className="ai-card">
          <div className="ai-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <strong>Smart Triage</strong>
            <p>AI-assisted priority, category & reply suggestions.</p>
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="avatar">SA</div>
        <div>
          <strong>Support Admin</strong>
          <span>Online</span>
        </div>
      </div>
    </aside>
  );
}
