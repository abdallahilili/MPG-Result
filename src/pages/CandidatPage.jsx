import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeft, BookOpen, Phone, CreditCard, 
  CheckCircle2, Clock, XCircle, Mail, FileCheck, Check
} from "lucide-react";
import { useCandidates } from "../hooks/useCandidates";

/**
 * CandidatPage
 * Redéfinition premium des détails d'un candidat.
 */
export default function CandidatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCandidatById, loading, error, candidates } = useCandidates();

  const candidat = getCandidatById(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <span className="text-4xl mb-4">❌</span>
        <p className="text-muted font-medium">{t("candidat.error")}</p>
        <p className="text-[10px] text-red/70 font-mono mt-2">{error}</p>
        <button onClick={() => navigate("/")} className="mt-6 text-primary font-bold text-sm">{t("candidat.back_home")}</button>
      </div>
    );
  }

  if (!candidat) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      >
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-muted mb-2 font-medium">{t("candidat.not_found")}</p>
        <p className="text-[10px] text-muted/50 mb-6 uppercase tracking-widest font-bold">
          {t("candidat.searched_id", { id, total: candidates.length })}
        </p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary font-bold transition-all hover:gap-3"
        >
          <ArrowLeft size={18} /> {t("candidat.back_home")}
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
      label: t("status.selectionne"),
      icon: <Check size={32} />
    },
    attente: {
      primary: "#f59e0b",
      soft: "bg-orange/5",
      border: "border-orange/20",
      text: "text-orange",
      label: t("status.attente"),
      icon: <Clock size={32} />
    },
    rejete: {
      primary: "#ef4444",
      soft: "bg-red/5",
      border: "border-red/20",
      text: "text-red",
      label: t("status.rejete"),
      icon: <XCircle size={32} />
    }
  };

  const theme = themes[candidat.statut] || themes.rejete;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      {/* ─── Header Navigation ────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1 rtl:rotate-180" />
          {t("candidat.back")}
        </button>
        <span className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.3em]">{t("candidat.profile_title")}</span>
      </div>

      {/* ─── Main Dashboard ───────────────────────────────────── */}
      <div className="bg-surface border border-border/50 rounded-2xl shadow-card overflow-hidden">
        
        {/* Identité Section */}
        <div className="pt-6 pb-4 px-8 bg-gradient-to-b from-bg/50 to-transparent flex flex-col items-start">
          <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mb-1 tracking-tight leading-tight">
            {candidat.nom}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {candidat.filiere}
          </span>
        </div>

        {/* Rangs Grid */}
        <div className="grid grid-cols-2 border-y border-border/40 bg-surface/50">
          <div className="py-4 flex flex-col items-center justify-center border-r-[1px] rtl:border-l-[1px] rtl:border-r-0 border-border/40">
            <span className="text-[8px] font-bold text-muted/50 uppercase tracking-widest mb-1">{t("candidat.national_rank")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-muted/30">#</span>
              <span className="text-xl font-black text-[#1c1917]">{candidat.rang}</span>
            </div>
          </div>
          <div className="py-4 flex flex-col items-center justify-center">
            <span className="text-[8px] font-bold text-muted/50 uppercase tracking-widest mb-1">{t("candidat.specialty_rank")}</span>
            <div className={`flex items-baseline gap-1 ${theme.text}`}>
              <span className="text-xs font-bold opacity-30">#</span>
              <span className="text-xl font-black">{candidat.rang_in_specialty}</span>
            </div>
          </div>
        </div>

        {/* Score & Status Visualization */}
        <div className="pt-1 py-12 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Ring with Gradient */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="100%" stopColor={theme.primary} stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
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
                <span className="text-2xl font-black leading-none">{score}</span>
                <span className="text-[9px] font-black opacity-30 mt-1 uppercase tracking-tighter">{t("candidat.points")}</span>
              </div>
            </div>
          </div>

          {/* Status Text (Close to circle, no badge) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 text-[13px] font-black uppercase tracking-[0.4em] ${theme.text}`}
          >
            {theme.label}
          </motion.div>
        </div>

        {/* Info Tiles Grid */}
        <div className="p-4 pt-0 bg-bg/20 grid grid-cols-2 gap-3 border-t border-border/40">
          <DetailTile icon={<Phone size={15} />} label={t("candidat.phone")} value={candidat.telephone} />
          <DetailTile icon={<CreditCard size={15} />} label={t("candidat.nni")} value={candidat.nni || t("candidat.not_provided")} />
          <DetailTile icon={<FileCheck size={15} />} label={t("candidat.folder_status")} value={candidat.status} color={theme.text} />
          <DetailTile icon={<Mail size={15} />} label={t("candidat.email")} value={candidat.email_addr} />
        </div>
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
