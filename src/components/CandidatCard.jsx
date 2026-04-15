import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Medal } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CandidatCard – ligne cliquable représentant un candidat dans la liste
 */
export default function CandidatCard({ candidat, index, showRang = true, useSpecialtyRank = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSelectionne = candidat.statut === "selectionne";
  const isAttente = candidat.statut === "attente";
  const isRejete = candidat.statut === "rejete";

  const displayRank = useSpecialtyRank ? (candidat.rang_in_specialty || candidat.rang) : candidat.rang;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.18 }}
      onClick={() => navigate(`/candidat/${candidat.id}`)}
      className={`
        flex items-center gap-3 p-2.5 bg-surface rounded-lg shadow-soft cursor-pointer
        hover:bg-bg transition-colors duration-150
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/candidat/${candidat.id}`)}
      aria-label={t("candidat.see_profile", { name: candidat.nom })}
    >
      {/* Rang */}
      {showRang && (
        <span className="flex items-center gap-0.5 text-xs font-bold text-muted min-w-[32px]">
          <Medal size={13} strokeWidth={2.5} className="text-muted/30" />
          {displayRank}
        </span>
      )}

      {/* Infos principales */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-semibold text-[#1c1917] truncate leading-tight">
          {candidat.nom}
        </span>
        <span className="text-[11px] text-muted mt-0.5 truncate uppercase tracking-tight">
          {candidat.filiere}
        </span>
      </div>

      {/* Badge statut */}
      <span className={`
        whitespace-nowrap px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest
        ${isSelectionne 
          ? 'bg-green-soft text-green' 
          : isAttente 
          ? 'bg-orange-soft text-orange'
          : 'bg-red-soft text-red'
        }
      `}>
        {isSelectionne ? t("status.selectionne") : isAttente ? t("status.attente_short") : t("status.rejete")}
      </span>

      <div className="text-muted/30">
        <ChevronRight size={18} strokeWidth={1.75} />
      </div>
    </motion.div>
  );
}
