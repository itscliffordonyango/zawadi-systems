import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

export const LoginPage: React.FC<Props> = ({ onLogin, error, loading }) => {
  const [email, setEmail] = useState('admin@zawadi.local');
  const [password, setPassword] = useState('Admin123!');

  return (
    <div className="login-shell">
      <div className="login-card">
        <div>
          <span className="badge">Production-ready Sales Management</span>
          <h1>Zawadi Sales Management System</h1>
          <p>Authenticate to access inventory control, sales processing, analytics, and user administration.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="stack-lg">
          <label>
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          {error ? <div className="error-banner">{error}</div> : null}
          <button disabled={loading} className="primary-btn">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="muted-card">
          <strong>Default seeded admin</strong>
          <div>admin@zawadi.local / Admin123!</div>
        </div>
      </div>
    </div>
  );
};
