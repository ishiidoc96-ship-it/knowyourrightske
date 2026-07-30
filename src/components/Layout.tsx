import { Link, Outlet, useLocation } from 'react-router-dom';
import { User, Home, BookOpen, Image as ImageIcon, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import NewsletterSignup from './NewsletterSignup';
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Library', path: '/library', icon: <BookOpen size={22} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={22} /> },
    { name: 'Ask', path: '/ask', icon: <HelpCircle size={22} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Disclaimer Banner */}
      <div className="bg-maroon text-white text-xs md:text-sm text-center py-2 px-4 transition-all">
        This platform provides general legal education, not legal advice.
      </div>

      {/* Sticky Header */}
      <header className={cn(
        "sticky top-0 z-50 glass-panel border-x-0 border-t-0 rounded-none transition-all duration-300",
        scrolled ? "py-2 bg-base/90 shadow-md backdrop-blur-xl" : "py-4 bg-base/60"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between transition-all duration-300">
            <div className="flex items-center">
              <Link to="/" className={cn(
                "font-bold font-display text-gold tracking-wider transition-all duration-300",
                scrolled ? "text-xl" : "text-xl md:text-2xl"
              )}>
                Know Your Rights KE
              </Link>
            </div>
            
            {/* Desktop Nav (>= 1024px) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={cn(
                    "font-medium transition-colors hover:text-gold active:scale-95",
                    location.pathname === item.path ? "text-gold" : "text-offwhite"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center gap-4 border-l border-gold/20 pl-6">
                  <Link 
                    to="/my-questions" 
                    className={cn(
                      "flex items-center gap-2 font-medium transition-colors hover:text-gold active:scale-95",
                      location.pathname === '/my-questions' ? "text-gold" : "text-offwhite"
                    )}
                  >
                    <User size={18} /> My Questions
                  </Link>
                  <button onClick={handleLogout} className="text-offwhite/50 text-sm hover:text-offwhite active:scale-95 transition-all">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-l border-gold/20 pl-6">
                  <Link to="/auth" className="px-4 py-2 border border-gold/50 text-gold rounded-full text-sm font-bold uppercase hover:bg-gold/10 transition-colors active:scale-95">
                    Log In
                  </Link>
                </div>
              )}
            </nav>
            
            {/* Mobile/Tablet Log In (if not handled by bottom tab) */}
            <div className="lg:hidden flex items-center">
              {!user ? (
                <Link to="/auth" className="text-sm font-bold uppercase text-gold hover:text-gold/80 active:scale-95 transition-all">
                  Log In
                </Link>
              ) : (
                <button onClick={handleLogout} className="text-sm font-bold uppercase text-offwhite/50 hover:text-offwhite active:scale-95 transition-all">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (extra bottom padding for mobile nav) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="glass-panel border-x-0 border-b-0 rounded-none bg-base mt-12 py-12 mb-[env(safe-area-inset-bottom,0px)] lg:mb-0 pb-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <p className="font-display text-2xl text-gold mb-2">Know Your Rights KE</p>
              <p className="text-offwhite/80 max-w-md">Empowering Kenyans with everyday legal knowledge. Because ignorance of the law is no defense.</p>
            </div>
            <div>
              <NewsletterSignup />
            </div>
          </div>
          
          <div className="text-center text-offwhite/50 border-t border-gold/10 pt-8 text-xs max-w-3xl mx-auto flex flex-col items-center justify-center relative">
            <p className="mb-2">
              Disclaimer: The content provided on this website and our affiliated social media platforms is for educational and informational purposes only. It does not constitute legal advice and does not establish an attorney-client relationship. If you require legal assistance, please consult a qualified advocate.
            </p>
            <Link to="/admin" className="w-4 h-4 rounded-full hover:bg-gold/10 flex items-center justify-center text-gold/30 hover:text-gold/80 transition-colors active:scale-95" title="Admin">
              <span className="text-[10px]">♦</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Persistent Bottom Tab Bar (Mobile & Tablet < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-x-0 border-b-0 rounded-none bg-base/90 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-90",
                location.pathname === item.path ? "text-gold" : "text-offwhite/60 hover:text-offwhite/90"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          ))}
          {user && (
            <Link 
              to="/my-questions"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-90",
                location.pathname === '/my-questions' ? "text-gold" : "text-offwhite/60 hover:text-offwhite/90"
              )}
            >
              <User size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
