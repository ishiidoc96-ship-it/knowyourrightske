import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { Lock, LogOut, CheckCircle2, Trash2, Video, BookOpen, BarChart } from 'lucide-react';
import AddContentForm from '../components/AddContentForm';
import AddArticleForm from '../components/AddArticleForm';

type QuestionRow = Database['public']['Tables']['questions']['Row'];
type ContentRow = Database['public']['Tables']['content']['Row'];
type ArticleRow = Database['public']['Tables']['articles']['Row'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<QuestionRow[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  
  const [loading, setLoading] = useState(false);
  
  const [answerLinks, setAnswerLinks] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'questions' | 'content' | 'articles'>('questions');

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      fetchAllData();
    } else {
      setAuthError('Invalid password');
    }
  };

  const fetchAllData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [questionsRes, contentRes, articlesRes] = await Promise.all([
        supabase.from('questions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('content').select('*').order('published_at', { ascending: false }),
        supabase.from('articles').select('*').order('published_at', { ascending: false }),
      ]);

      if (questionsRes.error) throw questionsRes.error;
      if (contentRes.error) throw contentRes.error;
      if (articlesRes.error) throw articlesRes.error;

      setQuestions(questionsRes.data || []);
      setPendingQuestions((questionsRes.data || []).filter(q => q.status === 'pending'));
      setContent(contentRes.data || []);
      setArticles(articlesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAnswered = async (id: string) => {
    if (!supabase) return;
    setUpdatingId(id);
    try {
      const link = answerLinks[id] || null;
      
      const { error } = await supabase
        .from('questions')
        .update({ 
          status: 'answered',
          answer_link: link
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setQuestions(q => q.map(item => item.id === id ? { ...item, status: 'answered', answer_link: link } : item));
      setPendingQuestions(q => q.filter(item => item.id !== id));
      
    } catch (err) {
      console.error(err);
      alert('Failed to update question');
    } finally {
      setUpdatingId(null);
    }
  };
  
  const handleDeleteContent = async (id: string) => {
    if (!supabase || !confirm('Are you sure you want to delete this content?')) return;
    try {
      const { error } = await supabase.from('content').delete().eq('id', id);
      if (error) throw error;
      setContent(c => c.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete content');
    }
  };
  
  const handleDeleteArticle = async (id: string) => {
    if (!supabase || !confirm('Are you sure you want to delete this article?')) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles(a => a.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete article');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto pt-20">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl space-y-6 text-center border-gold/30 shadow-2xl">
          <div className="w-16 h-16 mx-auto bg-maroon/20 rounded-full flex items-center justify-center text-gold mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display text-gold">Admin Access</h1>
          <p className="text-offwhite/60 text-sm">Enter password to manage content and questions.</p>
          
          {authError && <p className="text-red-400 text-sm">{authError}</p>}
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-base border border-gold/20 rounded-xl text-offwhite focus:outline-none focus:border-gold text-center tracking-widest"
            placeholder="••••••••"
          />
          
          <button
            type="submit"
            className="w-full py-3 bg-gold text-[1rem] font-bold uppercase tracking-wider rounded-xl hover:bg-gold/90 transition-colors text-[#331A21]"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Calculate Metrics
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.status === 'answered').length;
  
  const topicCounts = questions.reduce((acc, q) => {
    if (q.topic_tag) {
      acc[q.topic_tag] = (acc[q.topic_tag] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display text-gold">Admin Dashboard</h1>
          <p className="text-offwhite/60">Manage content, articles, and questions.</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-offwhite/60 hover:text-gold transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-gold/20 flex flex-col justify-center items-center text-center">
          <span className="text-4xl font-display text-gold mb-2">{totalQuestions}</span>
          <span className="text-sm uppercase tracking-wider text-offwhite/70 font-bold">Total Questions</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-gold/20 flex flex-col justify-center items-center text-center">
          <span className="text-4xl font-display text-gold mb-2">{answeredQuestions}</span>
          <span className="text-sm uppercase tracking-wider text-offwhite/70 font-bold">Answered</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-gold/20">
          <h3 className="text-sm uppercase tracking-wider text-offwhite/70 font-bold flex items-center justify-center gap-2 mb-4">
            <BarChart size={16} /> Top Topics
          </h3>
          <div className="space-y-2">
            {topTopics.length > 0 ? topTopics.map(([topic, count]) => (
              <div key={topic} className="flex justify-between items-center text-sm">
                <span className="text-offwhite">{topic}</span>
                <span className="text-gold font-bold bg-maroon/30 px-2 py-0.5 rounded">{count}</span>
              </div>
            )) : <div className="text-center text-sm text-offwhite/50">No topics yet</div>}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gold/20 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 font-bold uppercase text-sm tracking-wider rounded-t-lg transition-colors ${activeTab === 'questions' ? 'bg-maroon/50 text-gold border-b-2 border-gold' : 'text-offwhite/50 hover:text-offwhite'}`}
        >
          Questions ({pendingQuestions.length} Pending)
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-bold uppercase text-sm tracking-wider rounded-t-lg transition-colors ${activeTab === 'content' ? 'bg-maroon/50 text-gold border-b-2 border-gold' : 'text-offwhite/50 hover:text-offwhite'}`}
        >
          Content ({content.length})
        </button>
        <button 
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 font-bold uppercase text-sm tracking-wider rounded-t-lg transition-colors ${activeTab === 'articles' ? 'bg-maroon/50 text-gold border-b-2 border-gold' : 'text-offwhite/50 hover:text-offwhite'}`}
        >
          Articles ({articles.length})
        </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
        {loading ? (
          <div className="text-center py-8 text-offwhite/50 animate-pulse">Loading data...</div>
        ) : activeTab === 'questions' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-offwhite">Pending Questions</h2>
              <button onClick={fetchAllData} className="text-sm text-gold hover:underline">Refresh</button>
            </div>

            {pendingQuestions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gold/20 rounded-xl">
                <CheckCircle2 size={48} className="mx-auto text-gold/30 mb-4" />
                <p className="text-offwhite/60">All caught up! No pending questions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingQuestions.map((q) => (
                  <div key={q.id} className="bg-base/50 border border-gold/10 p-5 rounded-xl space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-3 flex-wrap">
                          {q.topic_tag && (
                            <span className="px-2 py-1 rounded bg-maroon/30 text-gold text-xs uppercase font-bold">
                              {q.topic_tag}
                            </span>
                          )}
                          <span className="text-xs text-offwhite/40">
                            {new Date(q.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-lg text-offwhite">{q.question_text}</p>
                        {q.email && <p className="text-sm text-offwhite/50">From: {q.email}</p>}
                      </div>
                      
                      <div className="w-full md:w-64 space-y-2 shrink-0">
                        <input 
                          type="text"
                          placeholder="Answer Link (optional URL)"
                          value={answerLinks[q.id] || ''}
                          onChange={(e) => setAnswerLinks({...answerLinks, [q.id]: e.target.value})}
                          className="w-full px-3 py-2 bg-base border border-gold/20 rounded text-sm text-offwhite focus:border-gold focus:outline-none"
                        />
                        <button
                          onClick={() => handleMarkAnswered(q.id)}
                          disabled={updatingId === q.id}
                          className="w-full py-2 bg-maroon text-gold font-bold text-sm uppercase rounded hover:bg-maroon/80 transition-colors disabled:opacity-50"
                        >
                          {updatingId === q.id ? 'Saving...' : 'Mark Answered'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'content' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-offwhite">Manage Content</h2>
            </div>
            <div className="mb-8">
              <AddContentForm onSuccess={fetchAllData} />
            </div>
            {content.length === 0 ? (
              <p className="text-offwhite/50">No content found.</p>
            ) : (
              <div className="space-y-4">
                {content.map(c => (
                  <div key={c.id} className="flex items-center justify-between bg-base/50 p-4 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <Video className="text-gold/50 shrink-0" />
                      <div>
                        <h4 className="text-offwhite font-medium">{c.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-gold bg-maroon/30 px-2 py-0.5 rounded uppercase">{c.platform}</span>
                          <span className="text-xs text-offwhite/50">{c.topic_tag}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteContent(c.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete Content"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'articles' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-offwhite">Manage Articles</h2>
            </div>
            <div className="mb-8">
              <AddArticleForm onSuccess={fetchAllData} />
            </div>
            {articles.length === 0 ? (
              <p className="text-offwhite/50">No articles found.</p>
            ) : (
              <div className="space-y-4">
                {articles.map(a => (
                  <div key={a.id} className="flex items-center justify-between bg-base/50 p-4 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <BookOpen className="text-gold/50 shrink-0" />
                      <div>
                        <h4 className="text-offwhite font-medium">{a.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-offwhite/50">{a.topic_tag}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteArticle(a.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
