import { useParams, useNavigate } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Phone, IdCard,
  Clock, XCircle, Check,
  GraduationCap, Briefcase, Flame, Target, Clock3
} from "lucide-react";
import { useCandidates } from "../hooks/useCandidates";

const BRAND = "#d97757";

const GRILLE = [
  { key: "score_niveau", label: "Niveau", max: 25, icon: GraduationCap },
  { key: "score_experience", label: "Expérience", max: 20, icon: Briefcase },
  { key: "score_motivation", label: "Motivation", max: 20, icon: Flame },
  { key: "score_adequation", label: "Adéquation", max: 20, icon: Target },
  { key: "score_disponibilite", label: "Disponibilité", max: 5, icon: Clock3, fixed: 5 },
];

/**
 * Animated Counter
 */
function AnimatedCounter({ to, duration = 1.4, delay = 0.3 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(0, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setCurrent(Math.round(v)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [to, duration, delay]);
  return <>{current}</>;
}

/**
 * CriterionRow for the official grid
 */
function CriterionRow({ criterion, score, index }) {
  const Icon = criterion.icon;
  const val = score != null ? score : (criterion.fixed ?? null);
  const pct = val != null ? Math.round((val / criterion.max) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.08, ease: "easeOut" }}
      className="flex items-center gap-3"
    >
      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 bg-bg/50">
        <Icon size={13} strokeWidth={2.3} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-muted">{criterion.label}</span>
          <span className="text-[10px] font-black text-[#1c1917]">
            {val != null ? val : "–"}
            <span className="text-[8px] font-normal text-muted/30"> /{criterion.max}</span>
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-bg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, delay: 0.9 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-primary/70"
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CandidatPage
 * Redéfinition premium des détails d'un candidat avec persistence des données d'évaluation.
 */
export default function CandidatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidatById, getCandidatDetailById, loading, error, candidates } = useCandidates();

  const candidat = getCandidatById(id);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setDetailLoading(true);
    getCandidatDetailById(id).then((d) => {
      setDetail(d);
      setDetailLoading(false);
    });
  }, [id, getCandidatDetailById]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !candidat) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      >
        <span className="text-4xl mb-4">{error ? "❌" : "⚠️"}</span>
        <p className="text-muted mb-2 font-medium">{error ? "Erreur de chargement." : "Candidat introuvable."}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-bold transition-all mt-4"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </motion.div>
    );
  }

  const score = candidat.score_total || 0;

  // Thèmes dynamiques selon l'état
  const themes = {
    selectionne: {
      primary: "#10b981",
      soft: "bg-green/5",
      border: "border-green/20",
      text: "text-green",
      label: "Sélectionné",
      icon: <Check size={32} />
    },
    attente: {
      primary: "#f59e0b",
      soft: "bg-orange/5",
      border: "border-orange/20",
      text: "text-orange",
      label: "En Attente",
      icon: <Clock size={32} />
    },
    rejete: {
      primary: "#ef4444",
      soft: "bg-red/5",
      border: "border-red/20",
      text: "text-red",
      label: "Rejeté",
      icon: <XCircle size={32} />
    }
  };

  const theme = themes[candidat.statut] || themes.rejete;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 py-6 mb-0"
    >

      {/* ─── Main Dashboard ───────────────────────────────────── */}
      <div className="bg-surface border border-muted pb-0 border-border/50 rounded-2xl shadow-card overflow-hidden">

        {/* Identité Section avec NNI en haut */}
        <div className="pt-6 pb-2 px-6 bg-gradient-to-b from-bg/50 to-transparent flex flex-col items-start border-b border-border/20">
          <div className="w-full flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mb-0 tracking-tight leading-tight">
                {candidat.nom}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {candidat.filiere}
              </span>
            </div>
          </div>

          {/* Info Tiles Grid */}
          <div className="p-0 pt-2 bg-bg/20 w-full grid grid-cols-2 gap-3 border-t border-border/40">
            <DetailTile icon={<Phone size={15} />} label="Téléphone" value={candidat.telephone ? "***" + candidat.telephone.slice(2) : "–"} />
            <DetailTile icon={<IdCard size={15} />} label="Numéro NNI" value={candidat.nni ? "****" + candidat.nni.slice(3) : "–"} />
          </div>
        </div>

        {/* Rangs Grid */}
        <div className="grid grid-cols-2 border-b border-border/40 bg-surface/50">
          <div className="py-2 flex flex-col items-center justify-center border-r border-border/40">
            <span className="text-[8px] font-bold text-muted/50 uppercase tracking-widest mb-1">Rang Général</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-muted/30">#</span>
              <span className="text-xl font-black text-[#1c1917]">{candidat.rang}</span>
            </div>
          </div>
          <div className="py-2 flex flex-col items-center justify-center">
            <span className="text-[8px] font-bold text-muted/50 uppercase tracking-widest mb-1">Dans la Spécialité</span>
            <div className={`flex items-baseline gap-1 ${theme.text}`}>
              <span className="text-xs font-bold opacity-30">#</span>
              <span className="text-xl font-black">{candidat.rang_in_specialty || "–"}</span>
            </div>
          </div>
        </div>

        {/* Score & Status Visualization */}
        <div className="pt-4 pb-10 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Ring with Gradient */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="100%" stopColor={theme.primary} stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle
                className="text-bg/60"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="72"
                cx="96"
                cy="96"
              />
              <motion.circle
                initial={{ strokeDashoffset: 452.4 }}
                animate={{ strokeDashoffset: 452.4 - (score / 100) * 452.4 }}
                transition={{ duration: 1.8, ease: "circOut" }}
                strokeWidth="12"
                strokeDasharray="452.4"
                stroke="url(#progressGradient)"
                strokeLinecap="round"
                fill="transparent"
                filter="url(#glow)"
                r="72"
                cx="96"
                cy="96"
              />
            </svg>

            {/* Inner Content (Glassmorphism & Depth) */}
            <div className={`
              w-36 h-36 rounded-full flex flex-col items-center justify-center 
              bg-white/40 backdrop-blur-sm border border-white/50 shadow-inner-lg
              ${theme.text}
            `}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="mb-1"
              >
                {theme.icon}
              </motion.div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black leading-none">
                  <AnimatedCounter to={score} />
                </span>
                <span className="text-[9px] font-black opacity-30 mt-1 uppercase tracking-tighter">Points / 100</span>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-2 mb-2 text-[13px] font-black uppercase tracking-[0.4em] ${theme.text}`}
          >
            {theme.label}
          </motion.div>
        </div>

        {/* ── Grille officielle (Persistent Data) ────────────────────── */}
        {score > 0 && (
          <div className="px-8 pb-8">
          
            {detailLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {GRILLE.map((c, i) => (
                  <div key={c.key} className={i === 0 ? "col-span-2 pb-2" : ""}>
                    <CriterionRow
                      criterion={c}
                      score={detail ? detail[c.key] : (c.fixed ?? null)}
                      index={i}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailTile({ icon, label, value, color }) {
  return (
    <div className="bg-white border border-border/20 rounded-xl p-3 flex items-center gap-3 shadow-sm">
      <div className={`w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-muted shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex flex-col justify-center">
        <p className="text-[7px] font-black text-muted/40 uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-bold text-[#1c1917] truncate leading-tight">{value}</p>
      </div>
    </div>
  );
}
