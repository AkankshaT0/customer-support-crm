import { Outlet, useLocation } from "react-router-dom";
import { Search, Bell, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const title =
    location.pathname === "/dashboard"
      ? "Operations dashboard"
      : location.pathname === "/new"
        ? "Create a support ticket"
        : location.pathname.startsWith("/tickets/")
          ? "Ticket workspace"
          : "Ticket inbox";
  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setOpen(!open)}>
        <Menu />
      </button>
      <div className={open ? "sidebar-wrap open" : "sidebar-wrap"}>
        <Sidebar />
      </div>
      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">SUPPORT OPERATIONS</p>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={17} />
              <span>Use the inbox search below</span>
              <kbd>/</kbd>
            </div>
            <button className="icon-button">
              <Bell size={19} />
              <i />
            </button>
            <div className="top-avatar">SA</div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
