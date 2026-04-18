// src/pages/HomePage.jsx
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, ChevronUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FiliereSelect from "../components/FiliereSelect";
import CandidatCard from "../components/CandidatCard";
import ErrorDisplay from "../components/ErrorDisplay";
import { useCandidates } from "../hooks/useCandidates";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Détecter le scroll pour afficher le bouton
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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

  const { 
    filieres, 
    filterCandidates, 
    loading, 
    error,
    retry
  } = useCandidates();

  const filtered = useMemo(
    () => filterCandidates(filiere, searchTerm),
    [filiere, searchTerm, filterCandidates]
  );

  const isFiliereSelected = filiere !== "Toutes les filières";
  const isSearching = searchTerm.trim().length > 0;

  // Grouper et trier les candidats (Tout se fait localement maintenant)
  const { selectionnes, attente, rejetes } = useMemo(() => {
    const groups = { selectionnes: [], attente: [], rejetes: [] };
    
    filtered.forEach(c => {
      if (c.statut === "selectionne") groups.selectionnes.push(c);
      else if (c.statut === "attente") groups.attente.push(c);
      else groups.rejetes.push(c);
    });
    
    const sortFn = (a, b) => {
      const rankA = isFiliereSelected ? (a.rang_in_specialty ?? a.rang) : a.rang;
      const rankB = isFiliereSelected ? (b.rang_in_specialty ?? b.rang) : b.rang;
      return (rankA ?? Infinity) - (rankB ?? Infinity);
    };
    
    return {
      selectionnes: groups.selectionnes.sort(sortFn),
      attente: groups.attente.sort(sortFn),
      rejetes: groups.rejetes
    };
  }, [filtered, isFiliereSelected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-muted uppercase tracking-widest">
          Chargement des résultats...
        </p>
      </div>
    );
  }

  if (error && error.type !== "warning") {
    return <ErrorDisplay error={error} onRetry={retry} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-5 py-10"
    >
      {/* Bannière d'avertissement si mode offline */}
      {error?.type === "network" && (
        <div className="mb-6 bg-orange-soft border border-orange/20 rounded-xl p-4 flex items-center gap-3">
          <span className="text-orange text-sm">⚠️</span>
          <p className="text-sm text-muted">{error.message}</p>
        </div>
      )}

      <div className="text-left text-lg font-bold text-muted mb-4">
        Résultats sélection MPG 2026
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <SearchBar onSearch={setSearchTerm} defaultValue={searchTerm} />
        <FiliereSelect
          filieres={filieres}
          value={filiere}
          onChange={setFiliere}
        />
      </section>

      {isFiliereSelected && !isSearching && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-surface rounded-lg border border-border text-[8px] font-bold uppercase tracking-widest shadow-soft">
          <span className="text-green flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green" /> 
            {selectionnes.length} sélectionné
          </span>
          <span className="text-muted/30">|</span>
          <span className="text-orange flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange" /> 
            {attente.length} en attente
          </span>
          <span className="text-muted/30">|</span>
          <span className="text-red flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red" /> 
            {rejetes.length} Non sélectionné
          </span>
        </div>
      )}

      <div className="space-y-8">
        {isSearching ? (
          <section>
            <SectionHeader title="Résultats de recherche" count={filtered.length} />
            {filtered.length === 0 ? (
              <EmptyState message={`Aucun résultat pour "${searchTerm}"`} />
            ) : (
              <div className="flex flex-col gap-1 mt-3">
                {filtered.map((c, index) => (
                  <CandidatCard
                    key={c.id}
                    candidat={c}
                    index={index}
                    showRang={false}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-6">
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
                    />
                  ))}
                </div>
              )}
            </section>

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
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>
      {/* Bouton Retour en haut */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary-dark transition-colors border-2 border-white/20 backdrop-blur-sm"
            aria-label="Retour en haut"
          >
            <ChevronUp size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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