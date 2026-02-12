'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseHelpers } from '@/lib/parse';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await parseHelpers.login(username, password);
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dark admin-grain min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background warm glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--admin-gold)_/_0.03)] blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--admin-rose)_/_0.04)] blur-[80px]" />

      <div className="w-full max-w-[380px] relative z-10">
        {/* Brand */}
        <div className="text-center mb-12">
          <img
            src="/rajus-impressions-icon.png"
            alt="Raju's Impressions"
            className="h-12 w-12 mx-auto mb-4 opacity-80"
          />
          <h1 className="font-serif text-xl text-[hsl(var(--admin-text))]">
            Raju&apos;s Impressions
          </h1>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[hsl(var(--admin-gold)_/_0.3)]" />
            <p className="text-[9px] tracking-[0.3em] uppercase text-[hsl(var(--admin-gold-dim))]">
              Studio
            </p>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[hsl(var(--admin-gold)_/_0.3)]" />
          </div>
        </div>

        {/* Login form */}
        <div className="admin-card p-8 admin-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))] mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-sm placeholder:text-[hsl(var(--admin-text-faint))] focus:outline-none focus:border-[hsl(var(--admin-gold-dim))] focus:ring-1 focus:ring-[hsl(var(--admin-gold)_/_0.15)] transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))] mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-sm placeholder:text-[hsl(var(--admin-text-faint))] focus:outline-none focus:border-[hsl(var(--admin-gold-dim))] focus:ring-1 focus:ring-[hsl(var(--admin-gold)_/_0.15)] transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[hsl(var(--admin-gold-dim))] hover:bg-[hsl(var(--admin-gold)_/_0.4)] text-[hsl(var(--admin-gold))] text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[9px] tracking-[0.2em] uppercase text-[hsl(var(--admin-text-faint)_/_0.5)] mt-8">
          Protected Area
        </p>
      </div>
    </div>
  );
}
