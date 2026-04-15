import { useMemo } from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchTerm = searchParams.get("s") || "";
  const filiere = searchParams.get("f") || "Toutes les filières";

  const setSearchTerm = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set("s", val);
    else next.delete("s");
    setSearchParams(next, { replace: true });
  };

  const setFiliere = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "Toutes les filières") next.set("f", val);
    else next.delete("f");
    setSearchParams(next, { replace: true });
  };

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
      const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : a.rang;
      const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : b.rang;
      return (rankA ?? Infinity) - (rankB ?? Infinity);
    });
  }, [filtered, isFiliereSelected]);

  const attente = useMemo(() => {
    return filtered
      .filter((c) => c.statut === "attente")
      .sort((a, b) => {
        const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : a.rang;
        const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : b.rang;
        return (rankA ?? Infinity) - (rankB ?? Infinity);
      });
  }, [filtered, isFiliereSelected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-muted uppercase tracking-widest">Chargement des résultats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <span className="text-4xl mb-4">❌</span>
        <p className="text-muted font-medium mb-4">Erreur lors du chargement des données.</p>
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
      <div className="text-left text-lg font-bold text-muted mb-4">
        Résultats sélection MPG 2026
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
            <SectionHeader title="Résultats de recherche" count={filtered.length} />
            {filtered.length === 0 ? (
              <EmptyState message={`Aucun résultat pour "${searchTerm}"`} />
            ) : (
              <div className="flex flex-col gap-1 mt-3">
                {filtered
                  .sort((a, b) => {
                    const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : a.rang;
                    const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : b.rang;
                    return (rankA ?? Infinity) - (rankB ?? Infinity);
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
                title="Candidats sélectionnés"
                count={selectionnes.length}
                dotColor="bg-green"
              />
              {selectionnes.length === 0 ? (
                <EmptyState message="Aucun candidat sélectionné." />
              ) : (
                <div className="flex flex-col gap-1 mt-3">
                  {selectionnes.map((c, index) => (
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

            {/* Liste d'attente */}
            {attente.length > 0 && (
              <>
                <hr className="border-border border-dashed my-6" />
                <section>
                  <SectionHeader
                    title="Liste d'attente"
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
