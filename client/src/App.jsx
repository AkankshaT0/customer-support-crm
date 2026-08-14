import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Inbox from './pages/Inbox';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';

import './styles.css';

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Protected admin area */}
        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route
              path="/"
              element={<Inbox />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/new"
              element={<NewTicket />}
            />

            <Route
              path="/tickets/:id"
              element={<TicketDetail />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}