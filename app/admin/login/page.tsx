'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-surface0 p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-text">Admin Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-subtext1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-overlay0 bg-mantle px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-subtext1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-overlay0 bg-mantle px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="rounded-lg bg-red/10 p-3 text-sm text-red">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue px-4 py-2 font-medium text-base transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
