import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setError('Enter your email, then click Resend.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (err) throw err;
      setMessage('Confirmation email re-sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Could not resend confirmation email');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email, then click Send magic link.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (err) throw err;
      setMessage('Magic sign-in link sent. Check your email.');
    } catch (err: any) {
      setError(err.message || 'Could not send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Ensure the confirmation link redirects back to this app
            emailRedirectTo: window.location.origin,
          },
        });
        if (err) throw err;
        setMessage('Check your email to confirm your account.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600 via-slate-900 to-black text-slate-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 via-indigo-500 to-cyan-400 rounded-3xl blur opacity-30 animate-pulse" />
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-fuchsia-200">
              ControlVerse
            </h1>
            <p className="mt-2 text-sm text-slate-300">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</p>
          </div>
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="••••••••"
                />
              </div>
              {error && <div className="text-sm text-rose-400">{error}</div>}
              {message && <div className="text-sm text-emerald-300">{message}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 transition-colors disabled:opacity-60"
              >
                {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>

              {mode === 'signup' && (
                <div className="text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <button type="button" onClick={handleResend} className="underline hover:text-white disabled:opacity-60" disabled={loading}>
                    Resend confirmation email
                  </button>
                  <button type="button" onClick={handleMagicLink} className="underline hover:text-white disabled:opacity-60" disabled={loading}>
                    Or send a magic sign-in link
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button className="underline hover:text-white" onClick={() => setMode('signin')}>Sign in</button>
                </span>
              ) : (
                <span>
                  New here?{' '}
                  <button className="underline hover:text-white" onClick={() => setMode('signup')}>Create an account</button>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Protected by Supabase Auth
        </div>
      </div>
    </div>
  );
}
