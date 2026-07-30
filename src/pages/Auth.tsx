import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/my-questions');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Signup successful! You can now log in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-maroon/20 rounded-full flex items-center justify-center text-gold mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display text-gold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-offwhite/70">
            {isLogin ? 'Log in to track your questions' : 'Sign up to ask legal questions'}
          </p>
        </div>

        {error && <div className="text-red-400 bg-red-400/10 p-3 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-offwhite mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-offwhite/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-offwhite mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-[1rem] font-bold uppercase tracking-wider rounded-xl hover:bg-gold/90 transition-colors text-[#331A21] disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold text-sm hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
