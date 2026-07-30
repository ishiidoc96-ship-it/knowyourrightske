import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';

type QuestionRow = Database['public']['Tables']['questions']['Row'];

export default function AskQuestion() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [email, setEmail] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [answeredQuestions, setAnsweredQuestions] = useState<QuestionRow[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAnswered() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('status', 'answered')
          .order('submitted_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAnsweredQuestions(data || []);
      } catch (err) {
        console.error("Failed to fetch answered questions", err);
      } finally {
        setLoadingAnswers(false);
      }
    }
    
    fetchAnswered();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!supabase) {
      setError('Database connection error.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('questions')
        .insert([{
          question_text: question,
          topic_tag: topic || null,
          email: email || null,
          status: 'pending',
          user_id: user?.id || null,
        }]);

      if (insertError) throw insertError;
      
      setSuccess(true);
      setQuestion('');
      setTopic('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TOPICS = [
    'Police Stops',
    'Arrest Rights',
    'Tenant Rights',
    'Employment Law',
    'Consumer Rights',
    'Access to Justice',
    'Family Law',
    'Other'
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Form Column */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display text-gold">Ask a Question</h1>
          <p className="text-offwhite/80 text-lg">
            Have a legal question affecting your daily life? Ask it here. We pick the most common questions to answer on our platforms.
          </p>
        </div>

        {!user ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-4">
            <h2 className="text-2xl font-display text-offwhite">Login Required</h2>
            <p className="text-offwhite/70">You must be logged in to submit a question.</p>
            <Link to="/auth" className="inline-block mt-4 px-6 py-2 bg-maroon/50 text-gold rounded-full font-bold uppercase tracking-wider hover:bg-maroon transition-colors">
              Log In / Sign Up
            </Link>
          </div>
        ) : success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 400 }}
            className="glass-panel p-8 rounded-2xl text-center border-gold/50 space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center text-gold">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-display text-gold">Question Received!</h2>
            <p className="text-offwhite/80">
              Thanks for asking. We read every submission and use them to create future educational content.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-2 bg-maroon/50 text-gold rounded-full font-bold uppercase tracking-wider hover:bg-maroon transition-colors"
            >
              Ask Another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <label htmlFor="question" className="block text-sm font-bold text-offwhite">
                Your Legal Question <span className="text-gold">*</span>
              </label>
              <textarea
                id="question"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="e.g. Can my landlord lock my house if I am one day late on rent?"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="topic" className="block text-sm font-bold text-offwhite">
                Topic Category (Optional)
              </label>
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Select a topic...</option>
                {TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-offwhite">
                Email Address (Optional)
              </label>
              <p className="text-xs text-offwhite/50 mb-2">We'll only use this if we need more context or to notify you if we answer it.</p>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gold text-[#331A21] font-display text-lg tracking-wider rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <HelpCircle size={20} />
                  Submit Question
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Answered Column */}
      <div className="space-y-6 lg:pl-12 lg:border-l border-gold/10">
        <h2 className="text-3xl font-display text-offwhite flex items-center gap-3">
          <MessageSquare className="text-gold" />
          Recently Answered
        </h2>
        
        {loadingAnswers ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel p-5 rounded-2xl animate-pulse space-y-3">
                <div className="h-4 w-20 bg-white/5 rounded-full"></div>
                <div className="h-5 w-full bg-white/5 rounded"></div>
                <div className="h-5 w-3/4 bg-white/5 rounded"></div>
              </div>
             ))}
          </div>
        ) : answeredQuestions.length === 0 ? (
          <div className="text-offwhite/50 italic">No questions answered yet. Be the first to ask!</div>
        ) : (
          <div className="space-y-4">
            {answeredQuestions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden"
              >
                {/* Decorative blob in bg */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-gold/5 blob-shape"></div>
                
                {q.topic_tag && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon/50 text-gold/80 border border-gold/20">
                    {q.topic_tag}
                  </span>
                )}
                
                <h3 className="text-lg font-medium text-offwhite relative z-10 leading-snug">
                  "{q.question_text}"
                </h3>
                
                {q.answer_link && (
                  <a 
                    href={q.answer_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gold text-sm font-bold hover:underline relative z-10 pt-2"
                  >
                    View our answer &rarr;
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
