import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Medal, BookOpen, CreditCard, Phone, CheckCircle2, Clock } from "lucide-react";
import { useCandidates } from "../hooks/useCandidates";

/**
 * CandidatPage
 * Affiche les détails d'un candidat : nom, rang, filière, statut.
 */
export default function CandidatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidatById } = useCandidates();

  const candidat = getCandidatById(id);

  // Candidat introuvable
  if (!candidat) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      >
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-muted mb-6 font-medium">Candidat introuvable.</p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary font-bold transition-all hover:gap-3"
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </button>
      </motion.div>
    );
  }

  const isSelectionne = candidat.statut === "selectionne";
  const initials = candidat.nom
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="max-w-xl mx-auto px-5 py-10"
    >
      {/* Bouton retour */}
      <button
        className="group flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-8"
        onClick={() => navigate("/")}
        aria-label="Retour"
      >
        <ArrowLeft size={18} strokeWidth={1.75} className="group-hover:-translate-x-1 transition-transform" />
        Retour à la recherche
      </button>

      {/* Carte principale */}
      <div className="bg-surface rounded-xl shadow-card p-6 sm:p-8 flex flex-col items-center border border-border/50">
        {/* Avatar / initiales */}
        <div className={`
          w-[72px] h-[72px] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-soft mb-6 transition-transform hover:scale-110
          ${isSelectionne ? 'bg-primary' : 'bg-orange'}
        `}>
          {initials}
        </div>

        {/* Nom */}
        <h1 className="text-xl font-extrabold text-[#1c1917] mb-3 text-center leading-tight">
          {candidat.nom}
        </h1>

        {/* Badge statut */}
        <div className={`
          flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-10
          ${isSelectionne ? 'bg-green-soft text-green' : 'bg-orange-soft text-orange'}
        `}>
          {isSelectionne 
            ? <CheckCircle2 size={16} strokeWidth={2} /> 
            : <Clock size={16} strokeWidth={2} />
          }
          {isSelectionne ? "Sélectionné(e)" : "Liste d'attente"}
        </div>

        {/* Grille d'infos */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <InfoItem label="Rang" value={`#${candidat.rang}`} icon={<Medal size={18} strokeWidth={1.75} />} />
          <InfoItem label="Filière" value={candidat.filiere} icon={<BookOpen size={18} strokeWidth={1.75} />} />
          <InfoItem label="NNI" value={candidat.nni} icon={<CreditCard size={18} strokeWidth={1.75} />} />
          <InfoItem label="Téléphone" value={candidat.telephone} icon={<Phone size={18} strokeWidth={1.75} />} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Composant local : ligne d'information ───────────────────────── */
function InfoItem({ label, value, icon }) {
  return (
    <div className="bg-bg rounded-lg p-3.5 flex items-center gap-4 transition-colors hover:bg-border/30 group">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-muted shadow-soft group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-wider text-muted font-bold mb-0.5">
          {label}
        </span>
        <span className="text-xs font-bold text-[#1c1917] leading-none">
          {value}
        </span>
      </div>
    </div>
  );
}
