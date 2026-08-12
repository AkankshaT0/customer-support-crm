import { useEffect, useState } from "react";
import {
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/api";
import TicketTable from "../components/TicketTable";
import { PRIORITIES, STATUS, CATEGORIES } from "../utils/constants";

export default function Inbox() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
  });
  const [data, setData] = useState({
    tickets: [],
    total: 0,
    page: 1,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const load = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getTickets({ ...filters, page, limit: 10 });
      setData(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => load(1), 250);
    return () => clearTimeout(timer);
  }, [filters.search, filters.status, filters.priority, filters.category]);
  const changePage = async (page) => {
    setLoading(true);
    try {
      const { data: d } = await getTickets({ ...filters, page, limit: 10 });
      setData(d);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-stack">
      <section className="hero-row">
        <div>
          <h2>
            All tickets <span>{data.total}</span>
          </h2>
          <p>Track, prioritize and resolve every customer request.</p>
        </div>
        <Link className="primary-button" to="/new">
          <Plus size={18} /> New ticket
        </Link>
      </section>
      <section className="panel inbox-panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search name, ID, email or description…"
            />
            <kbd>/</kbd>
          </div>
          <button
            className="ghost-button"
            onClick={() =>
              setFilters({ search: "", status: "", priority: "", category: "" })
            }
          >
            <RefreshCw size={16} /> Reset
          </button>
        </div>
        <div className="filter-row">
          <div className="filter-label">
            <SlidersHorizontal size={15} /> Filters
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            {STATUS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All categories</option>
            {CATEGORIES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <span className="filter-result">{data.total} matching</span>
        </div>
        <TicketTable tickets={data.tickets} loading={loading} />
        {data.pages > 1 && (
          <div className="pagination">
            <button
              disabled={data.page === 1}
              onClick={() => changePage(data.page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {data.page} of {data.pages}
            </span>
            <button
              disabled={data.page === data.pages}
              onClick={() => changePage(data.page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
