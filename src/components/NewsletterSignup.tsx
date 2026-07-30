import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !supabase) return;

    setStatus('loading');
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);
        
      if (error) {
        if (error.code === '23505') {
          throw new Error('This email is already subscribed.');
        }
        throw error;
      }
      
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to subscribe. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-panel p-6 rounded-2xl border-gold/30 flex flex-col items-center justify-center text-center space-y-3">
        <CheckCircle2 className="text-gold h-8 w-8" />
        <h4 className="text-xl font-display text-gold">You're on the list!</h4>
        <p className="text-sm text-offwhite/70">Thanks for subscribing. We'll keep you updated.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-gold text-xs underline mt-2"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border-gold/20 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-maroon/20 blob-shape blur-xl"></div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="text-gold h-5 w-5" />
          <h4 className="text-xl font-display text-offwhite">Stay Informed</h4>
        </div>
        
        <p className="text-sm text-offwhite/70">
          Get the latest legal rights education and updates delivered directly to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold transition-colors text-sm"
          />
          
          {status === 'error' && (
            <p className="text-red-400 text-xs">{errorMessage}</p>
          )}
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-maroon text-gold font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-maroon/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Subscribing...' : (
              <>
                Subscribe <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
