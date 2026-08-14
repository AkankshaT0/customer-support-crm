import { NavLink, useNavigate } from 'react-router-dom';

import {
  BarChart3,
  Inbox,
  Plus,
  Download,
  Sparkles,
  LifeBuoy,
  LogOut
} from 'lucide-react';

import { exportTickets } from '../services/api';

export default function Sidebar() {

  const navigate = useNavigate();

  const link = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;


  const handleLogout = () => {

    localStorage.removeItem(
      'supportflow_token'
    );

    localStorage.removeItem(
      'supportflow_admin'
    );

    navigate('/login');
  };


  const handleExport = async () => {

    try {

      const response = await exportTickets();

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: 'text/csv'
        })
      );

      const link = document.createElement('a');

      link.href = url;

      link.download =
        'supportflow-tickets.csv';

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        'Export failed:',
        error
      );
    }
  };


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

        <NavLink
          to="/"
          className={link}
        >
          <Inbox size={18} />
          All Tickets
        </NavLink>

        <NavLink
          to="/dashboard"
          className={link}
        >
          <BarChart3 size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/new"
          className={link}
        >
          <Plus size={18} />
          New Ticket
        </NavLink>

      </div>


      <div className="nav-section">

        <span>TOOLS</span>

        <button
          className="nav-link"
          onClick={handleExport}
        >
          <Download size={18} />
          Export CSV
        </button>


        <div className="ai-card">

          <div className="ai-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <strong>Smart Triage</strong>

            <p>
              AI-assisted priority, category
              & reply suggestions.
            </p>
          </div>

        </div>

      </div>


      <div className="sidebar-footer">

        <div className="avatar">
          SA
        </div>

        <div className="sidebar-admin-info">

          <strong>
            Support Admin
          </strong>

          <span>
            Online
          </span>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={15} />
        </button>

      </div>

    </aside>
  );
}