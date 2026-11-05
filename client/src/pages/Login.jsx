import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Authentication successful', {
        style: { background: '#0f172a', color: '#fff' }
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or security password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport">
      <div className="auth-background-grid" />
      <div className="auth-radial-glow" />

      <main className="auth-card-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-brand-section">
            <div className="auth-logo-symbol">
              <FiShield className="auth-logo-icon" />
            </div>
            <h1 className="auth-title">Administrative Portal</h1>
            <p className="auth-description">Enterprise financial ledger and member management system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="admin-email" className="auth-label">Administrator Email</label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-leading-icon" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="sulemanzaheer09@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="admin-password" className="auth-label">Security Password</label>
              </div>
              <div className="auth-input-wrapper">
                <FiLock className="auth-leading-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="auth-trailing-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-btn-spinner" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <FiArrowRight className="auth-submit-arrow" />
                </>
              )}
            </button>
          </form>

          {/* Security Compliance Badges */}
          <footer className="auth-footer-security">
            <span className="security-item">
              <FiCheckCircle className="security-icon" /> 256-bit Encrypted
            </span>
            <span className="security-bullet">•</span>
            <span className="security-item">MongoDB Cloud</span>
            <span className="security-bullet">•</span>
            <span className="security-item">JWT Session Guard</span>
          </footer>

          {/* Developer Attribution Link */}
          <div className="auth-developer-tag">
            <span>Developed by </span>
            <a
              href="https://suleman-zaheer.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="developer-portfolio-link"
            >
              <strong>Suleman Zaheer</strong>
              <FiExternalLink className="portfolio-link-glyph" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
