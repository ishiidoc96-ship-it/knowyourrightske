import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { Search, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

import TiltCard from '../components/TiltCard';

type ArticleRow = Database['public']['Tables']['articles']['Row'];

export default function Library() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchArticles() {
      if (!supabase) {
        setError('Supabase client is not configured.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const allTags = Array.from(new Set(articles.map(a => a.topic_tag).filter(Boolean))) as string[];
  
  const toggleTag = (tag: string) => {
    setActiveTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesTag = activeTags.size === 0 || activeTags.has(article.topic_tag);
    const query = searchQuery.toLowerCase();
    
    // Check title, summary, topic, and stringified body
    const matchesSearch = query === '' 
      ? true 
      : article.title.toLowerCase().includes(query) || 
        article.topic_tag.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        (typeof article.body === 'string' && article.body.toLowerCase().includes(query));
    
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display text-gold">Rights Library</h1>
        <p className="text-offwhite/80 text-lg max-w-2xl">
          Deep dives into the laws that affect your everyday life. Learn what the law says and exactly what it means for you.
        </p>
      </div>

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-offwhite/50" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gold/30 rounded-xl bg-base/50 text-offwhite placeholder-offwhite/50 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTags(new Set())}
            className={cn(
              "px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider transition-colors border",
              activeTags.size === 0 
                ? "bg-maroon text-gold border-maroon" 
                : "bg-transparent text-offwhite border-gold/30 hover:border-gold"
            )}
          >
            All Topics
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider transition-colors border",
                activeTags.has(tag) 
                  ? "bg-maroon text-gold border-maroon" 
                  : "bg-transparent text-offwhite border-gold/30 hover:border-gold"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {error ? (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-white/5 blob-shape-2 shrink-0"></div>
              <div className="space-y-4 w-full">
                <div className="h-4 bg-white/5 rounded w-16"></div>
                <div className="h-6 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border-dashed border-gold/20">
          <BookOpen className="mx-auto h-12 w-12 text-offwhite/30 mb-4" />
          <h3 className="text-xl font-display text-offwhite mb-2">No articles found</h3>
          <p className="text-offwhite/60">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <TiltCard
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={`/article/${article.id}`}
                className="block glass-panel p-6 rounded-2xl group hover:border-gold/50 transition-colors h-full"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="hidden md:flex w-16 h-16 bg-maroon/20 blob-shape-2 shrink-0 items-center justify-center">
                    <BookOpen className="text-gold/50 group-hover:text-gold transition-colors" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon text-gold">
                      {article.topic_tag}
                    </span>
                    <h2 className="text-2xl font-display text-offwhite group-hover:text-gold transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-offwhite/70 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="pt-2 text-gold/80 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read full article &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
