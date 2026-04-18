import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

const RECLAMATION_CAUSES = [
  "Erreur sur le score calculé",
  "Erreur sur l'expérience professionnelle",
  "Erreur sur le niveau d'études",
  "Diplôme non pris en compte",
  "Autre"
];

export default function ReclamationModal({ isOpen, onClose, candidatName, candidatId, onSuccess }) {
  const [cause, setCause] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('reclamations')
        .insert([
          { 
            candidate_id: candidatId,
            motif: cause,
            precisions: comment
          }
        ]);

      if (dbError) throw dbError;

      setIsSubmitting(false);
      setSuccess(true);
      
      // Notify parent
      if (onSuccess) onSuccess();
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCause("");
        setComment("");
      }, 2500);

    } catch (err) {
      console.error("Erreur lors de l'envoi de la réclamation:", err);
      setError("Désolé, une erreur est survenue lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  };

  const START_DATE = new Date("2026-04-18T22:00:00");
  const END_DATE = new Date(START_DATE.getTime() + 48 * 60 * 60 * 1000);
  const isDeadlinePassed = new Date() > END_DATE;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-sm rounded-lg border border-border shadow-soft overflow-hidden pointer-events-auto"
            >
              {/* Simple Header */}
              <div className="px-4 py-3 border-b border-border flex flex-col bg-surface">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1c1917]">
                      Réclamation
                    </span>
                  </div>
                  <button onClick={onClose} className="text-muted hover:text-black transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                {!isDeadlinePassed && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-bold text-primary uppercase tracking-tighter leading-none">
                      Délai de 48h en cours (débuté à 22:00 le 18/04)
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4">
                {error && (
                  <div className="mb-3 p-2 bg-red/5 border border-red/10 rounded text-[10px] text-red font-bold text-center">
                    {error}
                  </div>
                )}
                {!success ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted/50 uppercase px-1">Motif</p>
                      <select
                        required
                        value={cause}
                        onChange={(e) => setCause(e.target.value)}
                        className="w-full h-11 px-3 bg-surface border border-border rounded-md text-xs font-medium focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Choisir une cause...</option>
                        {RECLAMATION_CAUSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted/50 uppercase px-1">Précisions</p>
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Détaillez votre demande..."
                        className="w-full p-3 bg-surface border border-border rounded-md text-xs font-medium focus:outline-none focus:border-primary transition-all resize-none placeholder:text-muted/40"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !cause}
                      className="w-full bg-primary text-white h-11 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Envoyer</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-6 flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 bg-green/10 text-green rounded-full flex items-center justify-center">
                      <X size={20} className="rotate-45" /> {/* Just a check placeholder if we don't want to import Check */}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">Message envoyé</h4>
                      <p className="text-[10px] text-muted">Nous traiterons votre demande.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
