import { motion, AnimatePresence } from "framer-motion";
import { X, ListChecks, Clock, CheckCircle2, XCircle, MessageSquare, CalendarDays, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const STATUT_CONFIG = {
  en_attente: {
    label: "En attente",
    icon: <Clock size={11} />,
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  traitee: {
    label: "Traitée",
    icon: <CheckCircle2 size={11} />,
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  rejetee: {
    label: "Rejetée",
    icon: <XCircle size={11} />,
    className: "bg-red-50 text-red-500 border border-red-200",
  },
};

function StatutBadge({ statut }) {
  const config = STATUT_CONFIG[statut] || {
    label: statut || "Inconnu",
    icon: <AlertTriangle size={11} />,
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function ReclamationCard({ reclamation, index }) {
  const date = reclamation.date_reclamation
    ? new Date(reclamation.date_reclamation).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "–";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.07, ease: "easeOut" }}
      className="bg-white border border-border/40 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Card Header */}
      <div className="px-4 py-3 bg-surface/60 border-b border-border/30 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest mb-1">Motif</p>
          <p className="text-[11px] font-bold text-[#1c1917] leading-tight">{reclamation.motif || "–"}</p>
        </div>
        <StatutBadge statut={reclamation.statut} />
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Précisions */}
        {reclamation.precisions && (
          <div>
            <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest mb-1">Précisions</p>
            <p className="text-[11px] text-[#1c1917]/80 leading-relaxed">{reclamation.precisions}</p>
          </div>
        )}

        {/* Réponse admin */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-bg/60 border border-border/30">
          <MessageSquare size={13} className="text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest mb-1">Réponse admin</p>
            <p
              className={`text-[11px] leading-relaxed ${
                reclamation.reponse_admin
                  ? "font-medium text-[#1c1917]"
                  : "italic text-muted/50"
              }`}
            >
              {reclamation.reponse_admin || "Pas encore de réponse"}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <CalendarDays size={11} className="text-muted/40" />
          <span className="text-[9px] font-bold text-muted/40 uppercase tracking-widest">{date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReclamationListModal({ isOpen, onClose, candidatId }) {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !candidatId) return;

    setLoading(true);
    setError(null);

    supabase
      .from("reclamations")
      .select("id, motif, precisions, statut, date_reclamation, reponse_admin")
      .eq("candidate_id", candidatId)
      .order("date_reclamation", { ascending: false })
      .then(({ data, error: dbError }) => {
        if (dbError) {
          setError("Erreur lors du chargement des réclamations.");
        } else {
          setReclamations(data || []);
        }
        setLoading(false);
      });
  }, [isOpen, candidatId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-sm rounded-xl border border-border shadow-soft overflow-hidden pointer-events-auto flex flex-col"
              style={{ maxHeight: "80vh" }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface shrink-0">
                <div className="flex items-center gap-2">
                  <ListChecks size={14} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1c1917]">
                    Vos réclamations
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted hover:text-black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body (scrollable) */}
              <div className="overflow-y-auto p-4 space-y-3 flex-1">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : error ? (
                  <div className="py-8 flex flex-col items-center text-center gap-2">
                    <AlertTriangle size={28} className="text-red-400" />
                    <p className="text-[11px] font-bold text-red-500">{error}</p>
                  </div>
                ) : reclamations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-10 flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-bg flex items-center justify-center">
                      <ListChecks size={24} className="text-muted/30" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1c1917]/60">Pas de réclamation</p>
                      <p className="text-[10px] text-muted/40 mt-0.5">
                        Aucune réclamation trouvée pour votre dossier.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  reclamations.map((rec, i) => (
                    <ReclamationCard key={rec.id} reclamation={rec} index={i} />
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
