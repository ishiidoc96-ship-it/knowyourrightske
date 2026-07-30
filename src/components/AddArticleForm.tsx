import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

export default function AddArticleForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [summary, setSummary] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const body = { sections: [{ heading: "Main", content: bodyText }] };
      const { error } = await supabase.from('articles').insert([{
        title, topic_tag: topicTag, summary, body: body as any
      }]);
      if (error) throw error;
      onSuccess();
      setTitle(''); setTopicTag(''); setSummary(''); setBodyText('');
    } catch (err: any) {
      setError(err.message || 'Failed to add article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-base/50 p-6 rounded-xl border border-gold/20">
      <h3 className="text-xl font-display text-gold flex items-center gap-2"><BookOpen size={20}/> Add Article</h3>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input type="text" placeholder="Title" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" />
      <input type="text" placeholder="Topic Tag" required value={topicTag} onChange={e => setTopicTag(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" />
      <textarea placeholder="Summary" required value={summary} onChange={e => setSummary(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" rows={2} />
      <textarea placeholder="Body Text" required value={bodyText} onChange={e => setBodyText(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" rows={6} />
      <button type="submit" disabled={loading} className="px-6 py-2 bg-maroon text-gold font-bold uppercase rounded hover:bg-maroon/80 disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Article'}
      </button>
    </form>
  );
}
