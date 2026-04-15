import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SearchX, Info } from "lucide-react";
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

  // STATS : Calcul des rejetés
  const rejetes = useMemo(() => {
    return filtered.filter((c) => c.statut === "rejete");
  }, [filtered]);

  const selectionnes = useMemo(() => {
    let base = filtered.filter((c) => c.statut === "selectionne");

    return base.sort((a, b) => {
      if (!isFiliereSelected && a.filiere !== b.filiere) {
        return a.filiere.localeCompare(b.filiere);
      }
      const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : (a.rang_in_specialty ?? a.rang);
      const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : (b.rang_in_specialty ?? b.rang);
      return rankA - rankB;
    });
  }, [filtered, isFiliereSelected]);

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
      {/* ─── Guide utilisateur / Banner ──────────────────────────── */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-8 flex gap-3 shadow-sm">
        <Info className="text-green shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-bold text-green mb-1">Résultats publiés — Session 2025/2026</h3>
          <p className="text-xs text-green/80 font-medium leading-relaxed">
            Pour trouver votre résultat, utilisez la recherche ci-dessous en tapant votre <strong>Nom</strong>, votre <strong>Numéro de téléphone</strong> ou votre <strong>NNI</strong>. Vous pouvez aussi filtrer par filière.
          </p>
        </div>
      </div>

      {/* ─── Barre de recherche + filtre ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <SearchBar onSearch={setSearchTerm} />
        <FiliereSelect
          filieres={filieres}
          value={filiere}
          onChange={setFiliere}
        />
      </section>

      {/* ─── Statistiques de filière ─────────────────────────────── */}
      {isFiliereSelected && !isSearching && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-surface rounded-lg border border-border text-[10px] font-bold uppercase tracking-widest shadow-soft">
          <span className="text-green flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green" /> {selectionnes.length} sélectionnés</span>
          <span className="text-muted/30">|</span>
          <span className="text-orange flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange" /> {attente.length} en attente</span>
          <span className="text-muted/30">|</span>
          <span className="text-red flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red" /> {rejetes.length} rejetés</span>
        </div>
      )}

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
          /* Listes normales (Toutes les filières ou Filière spécifique) */
          <div className="space-y-6">
            {/* Sélectionnés */}
            <section>
              <SectionHeader 
                title={t("home.selected")} 
                count={selectionnes.length} 
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

            {/* Liste d'attente */}
            {attente.length > 0 && (
              <>
                <hr className="border-border border-dashed my-6" />
                <section>
                  <SectionHeader 
                    title={t("home.waiting_list")} 
                    count={attente.length} 
                    dotColor="bg-orange" 
                  />
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
                </section>
              </>
            )}
          </div>
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
