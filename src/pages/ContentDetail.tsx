import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import SocialIcon from '../components/SocialIcon';

type ContentRow = Database['public']['Tables']['content']['Row'];
type ArticleRow = Database['public']['Tables']['articles']['Row'];

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<ContentRow | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      if (!supabase) {
        setError('Supabase client is not configured.');
        setLoading(false);
        return;
      }
      
      if (!id) return;

      try {
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .single();

        if (contentError) throw contentError;
        
        if (contentData) {
          setContent(contentData);

          // Fetch related articles based on tag
          if (contentData.topic_tag) {
            const { data: articlesData, error: articlesError } = await supabase
              .from('articles')
              .select('*')
              .eq('topic_tag', contentData.topic_tag)
              .limit(3);
              
            if (!articlesError && articlesData) {
              setRelatedArticles(articlesData);
            }
          }
        } else {
          setError('Content not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [id]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-200 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Error Loading Content</h2>
        <p>{error}</p>
        <Link to="/" className="mt-4 inline-block text-gold hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  if (loading || !content) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-white/5 rounded"></div>
        <div className="aspect-video w-full bg-white/5 rounded-2xl"></div>
        <div className="h-10 w-3/4 bg-white/5 rounded"></div>
        <div className="h-4 w-full bg-white/5 rounded"></div>
        <div className="h-4 w-5/6 bg-white/5 rounded"></div>
      </div>
    );
  }

  const date = new Date(content.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Link to="/" className="inline-flex items-center text-offwhite/60 hover:text-gold transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Hub
      </Link>

      {/* Embed Container */}
      <div className="w-full aspect-video bg-maroon/10 rounded-3xl overflow-hidden shadow-2xl border border-gold/10">
        <iframe 
          src={content.embed_url.includes('youtube') || content.embed_url.includes('spotify') ? content.embed_url : ''} 
          className="w-full h-full" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          title={content.title}
        >
          {/* Fallback text if iframe src is empty or not standard */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-maroon/20 p-8 text-center">
            <p className="text-gold mb-4">View this content directly on {content.platform}</p>
            <a 
              href={content.embed_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gold text-[#331A21] rounded-full font-bold uppercase tracking-wider"
            >
              Open Link
            </a>
          </div>
        </iframe>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon text-gold">
            {content.topic_tag}
          </span>
          <div className="flex items-center gap-2">
            <SocialIcon platform={content.platform} size={16} className="text-offwhite/50" />
            <span className="text-offwhite/50 text-sm">{date}</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-display text-gold leading-tight">
          {content.title}
        </h1>
        <p className="text-offwhite/80 text-lg md:text-xl max-w-3xl">
          {content.description}
        </p>
      </header>

      {relatedArticles.length > 0 && (
        <div className="pt-12 mt-12 border-t border-gold/20">
          <h3 className="text-2xl font-display text-offwhite mb-6">Deep Dive: Read the Law</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((article) => (
              <Link 
                key={article.id}
                to={`/article/${article.id}`}
                className="block glass-panel p-5 rounded-2xl group hover:border-gold/50 transition-colors"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-maroon/20 blob-shape flex items-center justify-center shrink-0">
                    <BookOpen size={20} className="text-gold/50 group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display text-offwhite group-hover:text-gold transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-offwhite/60 text-sm line-clamp-2 mt-1">{article.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
