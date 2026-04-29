import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../types';
import type { AuthRequest } from '../types';
import { login } from '../api';
import ErrorBanner from '../components/ErrorBanner';

interface Props {
  auth: AuthResponse | null;
  onAuthSuccess: (auth: AuthResponse) => void;
}

export default function LoginPage({ auth, onAuthSuccess }: Props) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<AuthRequest>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      navigate(auth.roles.includes('ROLE_ADMIN') ? '/admin' : '/home');
    }
  }, [auth, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(loginData);
      onAuthSuccess(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unable to authenticate. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell container auth-page">
      <div className="card auth-card">
        <div className="status-row">
          <div>
            <h1 className="page-title">Welcome back</h1>
            <p className="page-subtitle">Sign in to access your portfolio, trade stocks, and manage your dashboard.</p>
          </div>
          <Link to="/register" className="secondary link-button">
            Create an account
          </Link>
        </div>

        <ErrorBanner message={error} />

        <form onSubmit={(event) => handleSubmit(event, 'login')} className="field-group">
          <label>
            Username
            <input
              value={loginData.username}
              onChange={(event) => setLoginData({ ...loginData, username: event.target.value })}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              value={loginData.password}
              onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
