import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import SocialIcon from '../components/SocialIcon';
import KenyanFlag from '../components/KenyanFlag';

type ArticleRow = Database['public']['Tables']['articles']['Row'];
type ContentRow = Database['public']['Tables']['content']['Row'];

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleRow | null>(null);
  const [relatedContent, setRelatedContent] = useState<ContentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!supabase) {
        setError('Supabase client is not configured.');
        setLoading(false);
        return;
      }
      
      if (!id) return;

      try {
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (articleError) throw articleError;
        
        if (articleData) {
          setArticle(articleData);

          if (articleData.related_content_id) {
            const { data: contentData, error: contentError } = await supabase
              .from('content')
              .select('*')
              .eq('id', articleData.related_content_id)
              .single();
              
            if (!contentError && contentData) {
              setRelatedContent(contentData);
            }
          }
        } else {
          setError('Article not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-200 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Error Loading Article</h2>
        <p>{error}</p>
        <Link to="/library" className="mt-4 inline-block text-gold hover:underline">
          &larr; Back to Library
        </Link>
      </div>
    );
  }

  if (loading || !article) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-white/5 rounded"></div>
        <div className="h-12 w-3/4 bg-white/5 rounded"></div>
        <div className="h-4 w-32 bg-white/5 rounded"></div>
        <div className="space-y-4 pt-8">
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  let bodySections: { heading: string; content: string }[] = [];
  try {
    const parsed = typeof article.body === 'string' ? JSON.parse(article.body) : article.body;
    bodySections = parsed.sections || [];
  } catch (e) {
    console.error("Failed to parse article body:", e);
  }

  const date = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-10"
    >
      <Link to="/library" className="inline-flex items-center text-offwhite/60 hover:text-gold transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Library
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon text-gold">
            {article.topic_tag}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gold/20 text-gold/70">
            <KenyanFlag size={12} className="rounded-sm" />
            Kenya
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display text-gold leading-tight">
          {article.title}
        </h1>
        <p className="text-offwhite/50 text-sm">Published on {date}</p>
      </header>

      <div className="glass-panel p-6 md:p-8 rounded-2xl text-offwhite/90 text-lg italic border-l-4 border-l-gold border-y-0 border-r-0">
        {article.summary}
      </div>

      <div className="space-y-12">
        {bodySections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-2xl font-display text-gold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-maroon/50 text-sm">
                <BookOpen size={16} />
              </span>
              {section.heading}
            </h2>
            <div className="text-offwhite/80 leading-relaxed space-y-4 whitespace-pre-wrap">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {relatedContent && (
        <div className="pt-12 mt-12 border-t border-gold/20">
          <h3 className="text-2xl font-display text-offwhite mb-6">Related Content</h3>
          <Link 
            to={`/content/${relatedContent.id}`}
            className="block glass-panel p-4 md:p-6 rounded-2xl group hover:border-gold/50 transition-colors"
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-maroon/20 blob-shape flex items-center justify-center shrink-0">
                <SocialIcon platform={relatedContent.platform} size={24} className="text-gold/50 group-hover:text-gold transition-colors duration-300" />
              </div>
              <div>
                <h4 className="text-lg font-display text-offwhite group-hover:text-gold transition-colors">
                  {relatedContent.title}
                </h4>
                <p className="text-offwhite/60 text-sm line-clamp-1">{relatedContent.description}</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
