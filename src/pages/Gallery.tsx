import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Image as ImageIcon, Video, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import TiltCard from '../components/TiltCard';
import SocialIcon from '../components/SocialIcon';

type GalleryRow = Database['public']['Tables']['gallery']['Row'];

export default function Gallery() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  
  // For Lightbox/Modal
  const [selectedItem, setSelectedItem] = useState<GalleryRow | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      if (!supabase) {
        setError('Supabase client is not configured.');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('published_at', { ascending: false });
          
        if (error) throw error;
        setItems(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    }
    
    fetchGallery();
  }, []);

  const allTags = Array.from(new Set(items.map(item => item.topic_tag).filter(Boolean))) as string[];
  const platforms = Array.from(new Set(items.map(item => item.platform).filter(Boolean))) as string[];

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.media_type !== filterType) return false;
    if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
    if (activeTags.size > 0 && item.topic_tag && !activeTags.has(item.topic_tag)) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setActiveTags(newTags);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display text-gold mb-4">Gallery</h1>
          <p className="text-xl text-offwhite/80">
            A curated archive of all educational media across platforms.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-gold mb-4 flex items-center gap-2">
              <Filter size={18} /> Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-offwhite/70 mb-2 uppercase tracking-wider">Media Type</h4>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="type" checked={filterType === 'all'} onChange={() => setFilterType('all')} className="accent-gold" />
                    <span className="text-offwhite group-hover:text-gold transition-colors">All Media</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="type" checked={filterType === 'video'} onChange={() => setFilterType('video')} className="accent-gold" />
                    <span className="text-offwhite group-hover:text-gold transition-colors flex items-center gap-2"><Video size={14}/> Videos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="type" checked={filterType === 'photo'} onChange={() => setFilterType('photo')} className="accent-gold" />
                    <span className="text-offwhite group-hover:text-gold transition-colors flex items-center gap-2"><ImageIcon size={14}/> Photos</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-offwhite/70 mb-2 uppercase tracking-wider">Platform</h4>
                <select 
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="w-full bg-base border border-gold/30 rounded p-2 text-offwhite focus:border-gold outline-none"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(p => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-offwhite/70 mb-2 uppercase tracking-wider">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 text-xs font-bold uppercase rounded-full transition-all duration-200 active:scale-95",
                        activeTags.has(tag) 
                          ? "bg-maroon text-gold shadow-md shadow-maroon/20" 
                          : "bg-base text-offwhite/70 border border-gold/20 hover:border-gold/50"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-maroon/10 rounded-2xl h-64 border border-gold/10"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 bg-red-400/10 p-4 rounded-xl">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-base/50 rounded-2xl border border-gold/10">
              <p className="text-offwhite/50 text-lg">No gallery items found matching your filters.</p>
              <button 
                onClick={() => { setFilterType('all'); setFilterPlatform('all'); setActiveTags(new Set()); }}
                className="mt-4 text-gold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredItems.map((item, index) => (
                <TiltCard
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (index % 5) * 0.1 }}
                  className="glass-panel p-4 rounded-2xl group cursor-pointer inline-block w-full break-inside-avoid shadow-md hover:shadow-lg hover:shadow-gold/10 border-transparent hover:border-gold/30 transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative rounded-xl overflow-hidden mb-3">
                    <img 
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'} 
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#331A21]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2 text-gold">
                        <SocialIcon platform={item.platform} size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">{item.media_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-1 bg-maroon text-gold text-[10px] font-bold uppercase rounded-full shrink-0">
                      {item.topic_tag}
                    </span>
                    <SocialIcon platform={item.platform} size={16} className="text-offwhite/50 shrink-0" />
                  </div>
                  <h3 className="font-display text-lg text-offwhite group-hover:text-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-base glass-panel rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-gold/10 flex justify-between items-center bg-[#331A21]/50">
                <div className="flex items-center gap-3">
                  <SocialIcon platform={selectedItem.platform} size={24} className="text-gold" />
                  <h3 className="font-display text-xl text-gold truncate">{selectedItem.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 text-offwhite hover:text-gold transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col items-center">
                {selectedItem.media_type === 'video' ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-6">
                    <iframe 
                      src={selectedItem.embed_or_image_url} 
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full max-w-3xl rounded-xl overflow-hidden mb-6 flex justify-center">
                    <img 
                      src={selectedItem.embed_or_image_url} 
                      alt={selectedItem.title}
                      className="max-h-[60vh] object-contain rounded-xl"
                    />
                  </div>
                )}
                
                <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <span className="px-3 py-1.5 bg-maroon text-gold text-xs font-bold uppercase rounded-full">
                    {selectedItem.topic_tag}
                  </span>
                  <a 
                    href={selectedItem.embed_or_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gold text-[#331A21] font-bold uppercase tracking-wider rounded-full hover:bg-gold/90 transition-colors active:scale-95 text-sm"
                  >
                    View Original
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
