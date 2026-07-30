import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Video } from 'lucide-react';

export default function AddContentForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('content').insert([{
        title, platform: platform as any, embed_url: embedUrl, topic_tag: topicTag, description
      }]);
      if (error) throw error;
      onSuccess();
      setTitle(''); setEmbedUrl(''); setTopicTag(''); setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-base/50 p-6 rounded-xl border border-gold/20">
      <h3 className="text-xl font-display text-gold flex items-center gap-2"><Video size={20}/> Add Content</h3>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input type="text" placeholder="Title" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" />
      <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none">
        <option value="youtube">YouTube</option>
        <option value="tiktok">TikTok</option>
        <option value="instagram">Instagram</option>
        <option value="podcast">Podcast</option>
      </select>
      <input type="text" placeholder="Embed URL" required value={embedUrl} onChange={e => setEmbedUrl(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" />
      <input type="text" placeholder="Topic Tag" required value={topicTag} onChange={e => setTopicTag(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" />
      <textarea placeholder="Description" required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-base border border-gold/20 rounded text-offwhite focus:border-gold outline-none" rows={3} />
      <button type="submit" disabled={loading} className="px-6 py-2 bg-maroon text-gold font-bold uppercase rounded hover:bg-maroon/80 disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Content'}
      </button>
    </form>
  );
}
