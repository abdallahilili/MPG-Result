import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, AlertTriangle } from "lucide-react";

/**
 * OfflineOverlay
 * A global component that displays a beautiful overlay when the connection is lost.
 * Includes a timeout before appearing to prevent flickering on unstable connections.
 */
export default function OfflineOverlay() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    const handleOnline = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsOnline(true);
      setShowOverlay(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Wait 1.5 seconds before showing the full overlay (the "time out" requested)
      timeoutId = setTimeout(() => {
        if (!navigator.onLine) {
          setShowOverlay(true);
        }
      }, 1500);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fdfcfb]/80 backdrop-blur-xl p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="bg-white border border-red/10 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] max-w-sm w-full text-center relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400/20 via-orange-400/20 to-red-400/20" />
            
            <div className="w-24 h-24 bg-red/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red shadow-inner relative">
              <WifiOff size={48} strokeWidth={1.5} className="relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red/10 rounded-[2rem]"
              />
            </div>

            <h2 className="text-3xl font-black text-[#1c1917] mb-4 tracking-tight leading-tight">
              Oups !<br />Connexion perdue
            </h2>
            
            <p className="text-muted text-sm leading-relaxed mb-10 font-medium px-4">
              Impossible de joindre le serveur. <span className="text-red/60 italic font-bold">(ERR_NAME_NOT_RESOLVED)</span>. 
              Vérifiez votre connexion internet ou vos réglages DNS.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-[#1c1917] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Réessayer maintenant
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted/40 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-red/40 animate-pulse" />
                Tentative de reconnexion en cours...
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
