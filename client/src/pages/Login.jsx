import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, LifeBuoy } from 'lucide-react';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await login(
        email,
        password
      );

      const { token, admin } = response.data;

      localStorage.setItem(
        'supportflow_token',
        token
      );

      localStorage.setItem(
        'supportflow_admin',
        JSON.stringify(admin)
      );

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">

          <div className="login-brand-mark">
            <LifeBuoy size={25} />
          </div>

          <div>
            <strong>SupportFlow</strong>
            <span>Customer CRM</span>
          </div>

        </div>


        <div className="login-heading">
          <p className="eyebrow">
            ADMIN PORTAL
          </p>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage customer support
            tickets and operations.
          </p>
        </div>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <label className="login-label">

            Email

            <div className="login-input">
              <Mail size={17} />

              <input
                type="email"
                placeholder="admin@supportflow.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

          </label>


          <label className="login-label">

            Password

            <div className="login-input">
              <Lock size={17} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

          </label>


          <button
            className="primary-button login-button"
            disabled={loading}
            type="submit"
          >

            <LogIn size={17} />

            {loading
              ? 'Signing in...'
              : 'Sign in'}

          </button>

        </form>


        <p className="login-security">
          🔒 Admin access is protected with JWT
          authentication.
        </p>

      </div>

    </div>
  );
}