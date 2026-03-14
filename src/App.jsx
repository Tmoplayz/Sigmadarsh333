import { useState, useEffect, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Ghost, ShieldAlert, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [notification, setNotification] = useState(null);

  const games = gamesData;

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredGames = useMemo(() => {
    return games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, games]);

  // Panic Mode: Changes tab title and favicon
  useEffect(() => {
    const originalTitle = document.title;
    const originalFavicon = document.querySelector("link[rel*='icon']");
    const originalHref = originalFavicon?.href || '/vite.svg';

    if (isPanicMode) {
      document.title = 'Google Docs';
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
      if (!document.querySelector("link[rel*='icon']")) document.getElementsByTagName('head')[0].appendChild(link);
    } else {
      document.title = 'Nebula Games Hub';
      if (originalFavicon) originalFavicon.href = originalHref;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [isPanicMode]);

  const openAboutBlank = (targetUrl) => {
    const url = targetUrl || window.location.href;
    const win = window.open();
    if (!win) {
      showNotification('Popup blocked! Please allow popups for this site.');
      return;
    }
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = url;
    win.document.body.appendChild(iframe);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Nebula Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500 text-white rounded-full shadow-lg font-medium flex items-center gap-2"
          >
            <ShieldAlert size={18} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Gamepad2 className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">Nebula</span>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPanicMode(!isPanicMode)}
              className={`p-2 rounded-lg transition-colors ${isPanicMode ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
              title="Panic Button (Failsafe)"
            >
              <ShieldAlert size={20} />
            </button>
            <button
              onClick={() => openAboutBlank()}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors"
              title="Open in About:Blank"
            >
              <Ghost size={20} />
            </button>
            <a
              href="https://tamoplayz890.github.io/react-example/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors"
              title="GitHub Mirror"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedGame ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold tracking-tight">{selectedGame.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAboutBlank(selectedGame.url)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                  title="Open Game in Cloaked Tab"
                >
                  <Ghost size={16} />
                  Cloak Game
                </button>
                <a
                  href={selectedGame.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <ExternalLink size={16} />
                  Open in New Tab
                </a>
              </div>
            </div>

            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                src={selectedGame.url}
                className="w-full h-full border-none"
                allowFullScreen
                title={selectedGame.title}
              />
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold mb-2">About {selectedGame.title}</h3>
              <p className="text-white/60 leading-relaxed">{selectedGame.description}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
                Unlimited <span className="text-emerald-500">Play.</span>
              </h1>
              <p className="text-white/40 text-lg max-w-2xl">
                The ultimate destination for unblocked web games. Fast, secure, and always available.
              </p>
            </div>

            {/* Mobile Search */}
            <div className="mb-8 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (game.id === 'nebula-github') {
                        window.open(game.url, '_blank', 'noopener,noreferrer');
                      } else {
                        setSelectedGame(game);
                      }
                    }}
                    className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="w-full h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          PLAY NOW
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                      <p className="text-white/40 text-sm line-clamp-2">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredGames.length === 0 && (
              <div className="py-20 text-center">
                <Ghost className="mx-auto text-white/10 mb-4" size={64} />
                <h3 className="text-xl font-medium text-white/40">No games found matching "{searchQuery}"</h3>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Gamepad2 className="text-black" size={18} />
            </div>
            <span className="font-bold tracking-tighter uppercase italic">Nebula Hub</span>
          </div>
          
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="https://tamoplayz890.github.io/react-example/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Mirror</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <p className="text-white/20 text-xs">
            © 2026 Nebula Games Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
