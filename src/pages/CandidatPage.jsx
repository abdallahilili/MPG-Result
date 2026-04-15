/**
 * CandidatPage – ATS Evaluation Card
 * Mobile-first | Framer Motion | Single brand color
 */
import { useParams, useNavigate } from "react-router-dom";
<<<<<<< HEAD
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
=======
import { motion, animate } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  GraduationCap, Briefcase, Flame, Target, Clock3,
  CheckCircle2, XCircle, Clock, Sparkles,
} from "lucide-react";
import { useCandidates } from "../hooks/useCandidates";

/* ─── Constants ─────────────────────────────────────────────────── */
const BRAND = "#d97757";
>>>>>>> 388976ecf0f6d070e6d314b634319a0ba62c1286

const GRILLE = [
  { key: "score_niveau", label: "Niveau", max: 25, icon: GraduationCap },
  { key: "score_experience", label: "Expérience", max: 20, icon: Briefcase },
  { key: "score_motivation", label: "Motivation", max: 20, icon: Flame },
  { key: "score_adequation", label: "Adéquation", max: 20, icon: Target },
  { key: "score_disponibilite", label: "Disponibilité", max: 5, icon: Clock3, fixed: 5 },
];

const SCORE_TIERS = [
  { min: 80, label: "Excellent", bg: "#dcfce7", text: "#16a34a", ring: "#16a34a" },
  { min: 65, label: "Bon", bg: "#dbeafe", text: "#2563eb", ring: "#2563eb" },
  { min: 50, label: "Moyen", bg: "#fef9c3", text: "#ca8a04", ring: "#ca8a04" },
  { min: 0, label: "Faible", bg: "#fee2e2", text: "#dc2626", ring: "#dc2626" },
];

<<<<<<< HEAD
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
=======
const RECRUITMENT_STATE = {
  selectionne: { label: "Sélectionné", bg: "#dcfce7", text: "#16a34a", icon: CheckCircle2 },
  attente: { label: "En attente", bg: "#fef9c3", text: "#ca8a04", icon: Clock },
  rejete: { label: "Rejeté", bg: "#fee2e2", text: "#dc2626", icon: XCircle },
};
>>>>>>> 388976ecf0f6d070e6d314b634319a0ba62c1286

/* ─── Helpers ────────────────────────────────────────────────────── */
function getScoreTier(score) {
  return SCORE_TIERS.find((t) => score >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1];
}

/* ─── Animated Counter ───────────────────────────────────────────── */
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

/* ─── Score Ring ─────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const R = 48;
  const circ = 2 * Math.PI * R;
  const tier = getScoreTier(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg
        width="120" height="120"
        viewBox="0 0 120 120"
        className="absolute inset-0 -rotate-90"
      >
<<<<<<< HEAD
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
=======
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        {/* Progress */}
        <motion.circle
          cx="60" cy="60" r={R}
          fill="none"
          stroke={tier.ring}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Inner badge */}
      <div className="z-10 flex flex-col items-center select-none">
        <span className="text-[30px] font-black leading-none" style={{ color: tier.ring }}>
          <AnimatedCounter to={score} />
        </span>
        <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: tier.ring, opacity: 0.5 }}>
          / 100
        </span>
      </div>
    </div>
  );
}
>>>>>>> 388976ecf0f6d070e6d314b634319a0ba62c1286

/* ─── Criterion Row ──────────────────────────────────────────────── */
function CriterionRow({ criterion, score, index }) {
  const Icon = criterion.icon;
  const val = score != null ? score : (criterion.fixed ?? null);
  const pct = val != null ? Math.round((val / criterion.max) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.08, ease: "easeOut" }}
      className="flex items-center gap-3"
    >
<<<<<<< HEAD
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
=======
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#f9f4f1" }}
      >
        <Icon size={13} strokeWidth={2.3} style={{ color: BRAND }} />
>>>>>>> 388976ecf0f6d070e6d314b634319a0ba62c1286
      </div>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-500">{criterion.label}</span>
          <span className="text-[10px] font-black text-slate-700">
            {val != null ? val : "–"}
            <span className="text-[8px] font-normal text-slate-300"> /{criterion.max}</span>
          </span>
        </div>
<<<<<<< HEAD

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
=======
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, delay: 0.6 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: BRAND, opacity: 0.75 }}
            className="h-full rounded-full"
          />
>>>>>>> 388976ecf0f6d070e6d314b634319a0ba62c1286
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function Badge({ children, bg, text, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 18 }}
      style={{ backgroundColor: bg, color: text }}
      className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
    >
      {children}
    </motion.span>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function CandidatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidatById, getCandidatDetailById, loading, error } = useCandidates();

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

  /* Loading */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div
          className="w-7 h-7 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: BRAND, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 px-6 text-center">
        <p className="text-sm text-slate-400">Erreur de chargement.</p>
        <button onClick={() => navigate("/")} className="text-sm font-bold" style={{ color: BRAND }}>
          ← Retour
        </button>
      </div>
    );
  }

  /* Not found */
  if (!candidat) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] gap-3 px-6 text-center"
      >
        <p className="text-sm text-slate-400">Candidat introuvable.</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: BRAND }}
        >
          <ArrowLeft size={14} /> Retour
        </button>
      </motion.div>
    );
  }

  /* Data */
  const score = candidat.score_total ?? 0;
  const tier = getScoreTier(score);
  const recState = RECRUITMENT_STATE[candidat.statut] || RECRUITMENT_STATE.rejete;
  const RecIcon = recState.icon;


  return (
    /* Full-width, max-w for mobile */
    <div className="w-full min-h-screen bg-[#f8f7f5] flex flex-col items-center px-4 py-6 pb-16">

      {/* ── Back button ─────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
        onClick={() => navigate("/")}
        className="self-start flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 hover:opacity-70 transition-opacity"
      >
        <ArrowLeft size={13} strokeWidth={3} />
        Retour
      </motion.button>

      {/* ── Main evaluation card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.008, boxShadow: "0 12px 40px rgba(0,0,0,0.09)" }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-md overflow-hidden"
      >
        {/* Top color strip */}
        <div className="h-[3px]" style={{ backgroundColor: BRAND }} />

        {/* ── Header: Avatar + Nom + Spécialité + NNI ─────────────────── */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-4">

            {/* Avatar initiales */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 260 }}
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: BRAND + "18" }}
            >
              <span className="text-[20px] font-black select-none" style={{ color: BRAND }}>
                {candidat.nom?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </motion.div>

            {/* Infos texte */}
            <div className="flex-1 min-w-0">
              {/* Nom */}
              <motion.h1
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
                className="text-[17px] font-black text-[#1c1917] leading-snug tracking-tight truncate"
              >
                {candidat.nom}
              </motion.h1>

              {/* Spécialité */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-[10px] font-bold uppercase tracking-widest truncate mt-0.5"
                style={{ color: BRAND }}
              >
                {candidat.filiere}
              </motion.p>
            </div>
          </div>

          {/* NNI — sous le nom, pleine largeur */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-4 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Numéro NNI
              </span>
              <span className="text-[15px] font-black text-[#1c1917] tracking-widest leading-tight mt-0.5">
                {candidat.nni || "Non renseigné"}
              </span>
            </div>
            {/* Petit séparateur décoratif */}
            <div className="ml-auto shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: BRAND + "40" }} />
          </motion.div>
        </div>


        {/* ── Score section ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-7 pb-5 px-6 gap-4">

          {/* Animated ring */}
          <ScoreRing score={score} />

          {/* Status badges — staggered */}
          <div className="flex flex-wrap justify-center gap-2">
            {/* Score quality */}
            <Badge bg={tier.bg} text={tier.text} delay={0.7}>
              <Sparkles size={10} />
              {tier.label}
            </Badge>

            {/* Recruitment state */}
            <Badge bg={recState.bg} text={recState.text} delay={0.8}>
              <RecIcon size={10} />
              {recState.label}
            </Badge>
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-6" />

        {/* ── Grille officielle ─────────────────────────────────────── */}
        <div className="px-6 py-5">
          {/* Section title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-[8px] font-black uppercase tracking-[0.35em] text-slate-300 mb-4 text-center"
          >
            Grille officielle · /100
          </motion.p>

          {detailLoading ? (
            <div className="flex justify-center py-4">
              <div
                className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#e2e8f0", borderTopColor: BRAND }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {GRILLE.map((c, i) => (
                <CriterionRow
                  key={c.key}
                  criterion={c}
                  score={detail ? detail[c.key] : (c.fixed ?? null)}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer info ───────────────────────────────────────────── */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400">
            Rang spéc.&nbsp;
            <span className="font-black text-slate-600">
              #{candidat.rang_in_specialty ?? "–"}
            </span>
          </span>
          <span className="text-[9px] font-bold text-slate-400">
            {candidat.telephone || "–"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
