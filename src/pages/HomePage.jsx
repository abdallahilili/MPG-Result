import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filiere, setFiliere] = useState("Toutes les filières");

  const { filieres, filterCandidates } = useCandidates();

  // Candidats filtrés selon recherche (validée) + filière
  const filtered = useMemo(
    () => filterCandidates(filiere, searchTerm),
    [filiere, searchTerm, filterCandidates]
  );

  // Séparation sélectionnés / liste d'attente, triés par rang
  const selectionnes = useMemo(
    () =>
      filtered
        .filter((c) => c.statut === "selectionne")
        .sort((a, b) => a.rang - b.rang),
    [filtered]
  );

  const attente = useMemo(
    () =>
      filtered
        .filter((c) => c.statut === "attente")
        .sort((a, b) => a.rang - b.rang),
    [filtered]
  );

  const isSearching = searchTerm.trim().length > 0;

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

      {/* ─── Résultats de recherche (mode recherche active) ──────── */}
      <div className="space-y-8">
        {isSearching ? (
          <section>
            <SectionHeader title="Résultats de recherche" count={filtered.length} />
            {filtered.length === 0 ? (
              <EmptyState message={`Aucun résultat pour "${searchTerm}"`} />
            ) : (
              <div className="flex flex-col gap-1 mt-3">
                {filtered
                  .sort((a, b) => a.rang - b.rang)
                  .map((c, index) => (
                    <CandidatCard key={c.id} candidat={c} index={index} />
                  ))}
              </div>
            )}
          </section>
        ) : (
          /* ─── Listes normales (sans recherche active) ─────────────── */
          <>
            {/* Sélectionnés */}
            <section>
              <SectionHeader 
                title="Candidats sélectionnés" 
                count={selectionnes.length} 
                dotColor="bg-green" 
              />
              {selectionnes.length === 0 ? (
                <EmptyState message="Aucun candidat sélectionné pour cette filière." />
              ) : (
                <div className="flex flex-col gap-1 mt-3">
                  {selectionnes.map((c, index) => (
                    <CandidatCard key={c.id} candidat={c} index={index} />
                  ))}
                </div>
              )}
            </section>

            <hr className="border-border my-1" />

            {/* Liste d'attente */}
            <section>
              <SectionHeader 
                title="Liste d'attente" 
                count={attente.length} 
                dotColor="bg-primary" 
              />
              {attente.length === 0 ? (
                <EmptyState message="Aucun candidat en liste d'attente." />
              ) : (
                <div className="flex flex-col gap-1 mt-3">
                  {attente.map((c, index) => (
                    <CandidatCard key={c.id} candidat={c} index={index} />
                  ))}
                </div>
              )}
            </section>
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
      <span className="bg-border/50 text-muted px-2.5 py-0.5 rounded-full text-[9px] font-bold">
        {count}
      </span>
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
