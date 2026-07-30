import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion } from 'motion/react';
import { Search, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

import TiltCard from '../components/TiltCard';
import SocialIcon from '../components/SocialIcon';

type ContentRow = Database['public']['Tables']['content']['Row'];
type ArticleRow = Database['public']['Tables']['articles']['Row'];

type FeedItem = 
  | { _type: 'content'; id: string; title: string; topic_tag: string; description: string; platform: string; published_at: string }
  | { _type: 'article'; id: string; title: string; topic_tag: string; description: string; published_at: string };

export default function Home() {
  const [content, setContent] = useState<ContentRow[]>([]);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchAll() {
      if (!supabase) {
        setError('Supabase client is not configured. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        const [contentRes, articlesRes] = await Promise.all([
          supabase.from('content').select('*').order('published_at', { ascending: false }),
          supabase.from('articles').select('*').order('published_at', { ascending: false }),
        ]);

        if (contentRes.error) throw contentRes.error;
        if (articlesRes.error) throw articlesRes.error;

        setContent(contentRes.data || []);
        setArticles(articlesRes.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const feed: FeedItem[] = [
    ...content.map(c => ({ _type: 'content' as const, id: c.id, title: c.title, topic_tag: c.topic_tag, description: c.description, platform: c.platform, published_at: c.published_at })),
    ...articles.map(a => ({ _type: 'article' as const, id: a.id, title: a.title, topic_tag: a.topic_tag, description: a.summary, published_at: a.published_at })),
  ].sort((a, b) => {
    const diff = new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    return sortBy === 'newest' ? diff : -diff;
  });

  const allTags = Array.from(new Set(feed.map(c => c.topic_tag).filter(Boolean))) as string[];
  
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

  const filteredFeed = feed.filter(item => {
    const matchesTag = activeTags.size === 0 || activeTags.has(item.topic_tag);
    const query = searchQuery.toLowerCase();
    const matchesSearch = query === '' 
      ? true 
      : item.title.toLowerCase().includes(query) || 
        item.topic_tag.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
        
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gold"
        >
          The Law, Simplified.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-offwhite/90 max-w-2xl mx-auto"
        >
          Answering the everyday legal questions of Kenyans. No jargon, just your rights.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-6 pt-4"
        >
          <a href="#" className="p-3 bg-maroon/20 rounded-full text-gold hover:bg-maroon/40 transition-colors">
            <SocialIcon platform="tiktok" size={24} />
          </a>
          <a href="#" className="p-3 bg-maroon/20 rounded-full text-gold hover:bg-maroon/40 transition-colors">
            <SocialIcon platform="instagram" size={24} />
          </a>
          <a href="#" className="p-3 bg-maroon/20 rounded-full text-gold hover:bg-maroon/40 transition-colors">
            <SocialIcon platform="youtube" size={24} />
          </a>
          <a href="#" className="p-3 bg-maroon/20 rounded-full text-gold hover:bg-maroon/40 transition-colors">
            <SocialIcon platform="podcast" size={24} />
          </a>
        </motion.div>
      </section>

      {/* Content Hub */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-display text-offwhite">Latest</h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-base border border-gold/30 text-offwhite rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-offwhite/50" />
            </div>
            <input
              type="text"
              placeholder="Search content and articles..."
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

        {/* Grid */}
        {error ? (
          <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md">
            {error}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-panel p-4 rounded-2xl animate-pulse space-y-4">
                <div className="w-full h-48 bg-white/5 rounded-2xl blob-shape"></div>
                <div className="h-6 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-1/4"></div>
                <div className="h-16 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-gold/20">
            <Search className="mx-auto h-8 w-8 text-offwhite/30 mb-2" />
            <p className="text-offwhite/70">Nothing here yet. Check the Library for articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((item, index) => {
              if (item._type === 'content') {
                return (
                  <TiltCard
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-5 rounded-2xl flex flex-col group cursor-pointer border-transparent hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link to={`/content/${item.id}`} className="flex-grow flex flex-col h-full w-full">
                      <div className="relative w-full h-48 mb-4 overflow-hidden bg-maroon/20 blob-shape flex items-center justify-center border border-gold/10">
                        <SocialIcon platform={item.platform} size={48} className="text-gold/50 group-hover:text-gold transition-colors duration-300" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon text-gold">
                          {item.topic_tag}
                        </span>
                        <SocialIcon platform={item.platform} size={18} className="text-offwhite/50" />
                      </div>
                      
                      <h3 className="text-xl font-display text-offwhite group-hover:text-gold transition-colors duration-300 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-offwhite/70 text-sm line-clamp-3">
                        {item.description}
                      </p>
                    </Link>
                  </TiltCard>
                );
              }
              return (
                <TiltCard
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-5 rounded-2xl flex flex-col group cursor-pointer border-transparent hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <Link to={`/article/${item.id}`} className="flex-grow flex flex-col h-full w-full">
                    <div className="relative w-full h-48 mb-4 overflow-hidden bg-maroon/20 blob-shape flex items-center justify-center border border-gold/10">
                      <BookOpen size={48} className="text-gold/50 group-hover:text-gold transition-colors duration-300" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon text-gold">
                        {item.topic_tag}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-display text-offwhite group-hover:text-gold transition-colors duration-300 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-offwhite/70 text-sm line-clamp-3">
                      {item.description}
                    </p>
                  </Link>
                </TiltCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
