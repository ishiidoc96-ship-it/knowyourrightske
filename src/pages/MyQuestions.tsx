import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

type QuestionRow = Database['public']['Tables']['questions']['Row'];

export default function MyQuestions() {
  const { user, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    const fetchMyQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error("Error fetching my questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="text-center py-20 text-offwhite/50 animate-pulse">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display text-gold">My Questions</h1>
          <p className="text-offwhite/70">Track the status of the legal questions you've asked.</p>
        </div>
        <Link to="/ask" className="px-5 py-2 bg-maroon text-gold rounded-full font-bold uppercase text-sm tracking-wide">
          Ask New
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-4 border-dashed border-gold/30">
          <MessageSquare className="mx-auto h-12 w-12 text-gold/30" />
          <h3 className="text-2xl font-display text-offwhite">No questions asked yet</h3>
          <p className="text-offwhite/60 max-w-md mx-auto">
            Have a legal issue or scenario you're confused about? Ask us and we might answer it on our platforms!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-start gap-4 border-l-4 border-l-gold"
            >
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded ${q.status === 'answered' ? 'bg-green-900/30 text-green-400' : 'bg-gold/10 text-gold/70'}`}>
                    {q.status === 'answered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {q.status}
                  </span>
                  <span className="text-xs text-offwhite/40">
                    {new Date(q.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg text-offwhite">{q.question_text}</h3>
              </div>
              
              {q.status === 'answered' && q.answer_link && (
                <div className="shrink-0 pt-2 md:pt-0">
                  <a 
                    href={q.answer_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm font-medium hover:bg-gold/20 transition-colors"
                  >
                    View Answer
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
