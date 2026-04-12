import { useState, useMemo } from "react";
import defaultData from "../data/candidates.json";

/**
 * useCandidates
 * Charge les candidats depuis le fichier JSON (ou un fichier uploadé)
 * et expose des fonctions de filtrage.
 */
export function useCandidates() {
  const [candidates] = useState(defaultData);

  // Liste des filières uniques
  const filieres = useMemo(() => {
    const set = new Set(candidates.map((c) => c.filiere));
    return ["Toutes les filières", ...Array.from(set).sort()];
  }, [candidates]);

  /**
   * Filtre les candidats par filière et par terme de recherche
   * (nom, téléphone ou NNI)
   */
  function filterCandidates(filiere, searchTerm) {
    return candidates.filter((c) => {
      const matchFiliere =
        !filiere || filiere === "Toutes les filières" || c.filiere === filiere;

      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        !term ||
        c.nom.toLowerCase().includes(term) ||
        c.telephone.includes(term) ||
        c.nni.includes(term);

      return matchFiliere && matchSearch;
    });
  }

  /**
   * Trouve un candidat par son id
   */
  function getCandidatById(id) {
    return candidates.find((c) => c.id === id) || null;
  }

  return { candidates, filieres, filterCandidates, getCandidatById };
}
