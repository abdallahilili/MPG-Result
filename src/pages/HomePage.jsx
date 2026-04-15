import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FiliereSelect from "../components/FiliereSelect";
import CandidatCard from "../components/CandidatCard";
import { useCandidates } from "../hooks/useCandidates";

/**
 * HomePage
 * - Champ de recherche (nom / téléphone / NNI) - validé au clic
 * - Dropdown pour filtrer par filière
 * - Liste des sélectionnés (triés par rang)
 * - Liste d'attente (triés par rang)
 */
export default function HomePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filiere, setFiliere] = useState("Toutes les filières");

  const { filieres, filterCandidates, loading, error, candidates } = useCandidates();

  // Candidats filtrés selon recherche (validée) + filière
  const filtered = useMemo(
    () => filterCandidates(filiere, searchTerm),
    [filiere, searchTerm, filterCandidates]
  );

  const isFiliereSelected = filiere !== "Toutes les filières";

  // Séparation sélectionnés / liste d'attente

  const isSearching = searchTerm.trim().length > 0;
  const showTopByFiliere = !isSearching && filiere === "Toutes les filières";

const selectionnes = useMemo(() => {
  let base = filtered.filter((c) => c.statut === "selectionne");

  if (showTopByFiliere) {
    const categories = filieres.filter(f => f !== "Toutes les filières");
    let top3All = [];
    categories.forEach(cat => {
      const top3 = base
        .filter(c => c.filiere === cat)
        .sort((a, b) => {
          // ✅ Toujours utiliser rang_in_specialty en priorité
          const rankA = a.rang_in_specialty ?? a.rang;
          const rankB = b.rang_in_specialty ?? b.rang;
          return rankA - rankB;
        })
        .slice(0, 3);
      top3All = [...top3All, ...top3];
    });
    base = top3All;

    // ✅ Tri final : par filière alphabétique, puis par rang_in_specialty
    return base.sort((a, b) => {
      if (a.filiere !== b.filiere) return a.filiere.localeCompare(b.filiere);
      const rankA = a.rang_in_specialty ?? a.rang;
      const rankB = b.rang_in_specialty ?? b.rang;
      return rankA - rankB;
    });
  }

  // Mode filière spécifique ou recherche
  return base.sort((a, b) => {
    const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : a.rang;
    const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : b.rang;
    return rankA - rankB;
  });
}, [filtered, isFiliereSelected, showTopByFiliere, filieres]);

  const attente = useMemo(() => {
    return filtered
      .filter((c) => c.statut === "attente")
      .sort((a, b) => {
        const rankA = isFiliereSelected ? (a.rang_in_specialty || a.rang) : a.rang;
        const rankB = isFiliereSelected ? (b.rang_in_specialty || b.rang) : b.rang;
        return rankA - rankB;
      });
  }, [filtered, isFiliereSelected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-muted uppercase tracking-widest">{t("home.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <span className="text-4xl mb-4">❌</span>
        <p className="text-muted font-medium mb-4">{t("home.error")}</p>
        <p className="text-[10px] text-red/70 font-mono bg-red-soft px-3 py-1 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-5 py-10"
    >
      {/* ─── Barre de recherche + filtre ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        <SearchBar onSearch={setSearchTerm} />
        <FiliereSelect
          filieres={filieres}
          value={filiere}
          onChange={setFiliere}
        />
      </section>

      {/* ─── Contenu Principal ───────────────────────────────────── */}
      <div className="space-y-8">
        {isSearching ? (
          /* Résultats de recherche active */
          <section>
            <SectionHeader title={t("home.search_results")} count={filtered.length} />
            {filtered.length === 0 ? (
              <EmptyState message={t("home.no_results", { term: searchTerm })} />
            ) : (
              <div className="flex flex-col gap-1 mt-3">
                {filtered
                  .sort((a, b) => {
                    const rankA = isFiliereSelected ? (a.rang_in_specialty || a.rang) : a.rang;
                    const rankB = isFiliereSelected ? (b.rang_in_specialty || b.rang) : b.rang;
                    return rankA - rankB;
                  })
                  .map((c, index) => (
                    <CandidatCard 
                      key={c.id} 
                      candidat={c} 
                      index={index} 
                      useSpecialtyRank={isFiliereSelected}
                    />
                  ))}
              </div>
            )}
          </section>
        ) : (
          /* Listes normales (Top 3 ou Filière spécifique) */
          <>
            {/* Sélectionnés */}
            <section>
              <SectionHeader 
                title={showTopByFiliere ? t("home.top_3") : t("home.selected")} 
                count={showTopByFiliere ? null : selectionnes.length} 
                dotColor="bg-green" 
              />
              {selectionnes.length === 0 ? (
                <EmptyState message={t("home.no_selected")} />
              ) : (
                <div className="flex flex-col gap-1 mt-3">
                  {selectionnes.map((c, index) => (
                    <CandidatCard 
                      key={c.id} 
                      candidat={c} 
                      index={index} 
                      useSpecialtyRank={true}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Liste d'attente (Uniquement si pas en mode Top 3) */}
            {!showTopByFiliere && (
              <>
                <hr className="border-border my-1" />
                <section>
                  <SectionHeader 
                    title={t("home.waiting_list")} 
                    count={attente.length} 
                    dotColor="bg-primary" 
                  />
                  {attente.length === 0 ? (
                    <EmptyState message={t("home.no_waiting")} />
                  ) : (
                    <div className="flex flex-col gap-1 mt-3">
                      {attente.map((c, index) => (
                        <CandidatCard 
                          key={c.id} 
                          candidat={c} 
                          index={index} 
                          useSpecialtyRank={isFiliereSelected}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ── Composants locaux ─────────────────────────────────────────── */

function SectionHeader({ title, count, dotColor }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xs font-bold text-[#1c1917] flex items-center gap-2 uppercase tracking-widest">
        {dotColor && <span className={`w-2 h-2 rounded-full ${dotColor} shadow-sm`} />}
        {title}
      </h2>
      {count !== null && (
        <span className="bg-border/50 text-muted px-2.5 py-0.5 rounded-full text-[9px] font-bold">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-border rounded-xl bg-surface/40 mt-4">
      <SearchX size={32} strokeWidth={1.5} className="text-muted/30 mb-3" />
      <p className="text-xs text-muted font-medium text-center">{message}</p>
    </div>
  );
}
