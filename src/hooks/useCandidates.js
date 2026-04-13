import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * useCandidates
 * Charge les candidats depuis Supabase (vue v_candidates_result)
 * et expose des fonctions de filtrage.
 */
export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("v_candidates_result")
          .select("*");

        if (fetchError) throw fetchError;

        // On mappe les champs de la vue vers les noms attendus par l'application
        const mappedData = data.map((c) => {
          let mappedStatut = "rejete"; // Par défaut, tout ce qui n'est pas sélectionné ou en attente est rejeté
          const etat = (c.etat || "").toLowerCase().trim();
          
          if (etat === "selectionne" || etat === "selectione") {
            mappedStatut = "selectionne";
          } else if (etat === "en_attente" || etat === "en_attante" || etat === "attente") {
            mappedStatut = "attente";
          }

          const email = (c.email_addr || "").toLowerCase().trim();
          const mappedEmail = (email.startsWith("papier") || email.startsWith("candida")) 
            ? "Non identifié" 
            : c.email_addr;

          return {
            ...c,
            nom: c.name || "Sans nom",
            filiere: c.specialty || "Non spécifié",
            email_addr: mappedEmail,
            statut: mappedStatut,
            telephone: c.telephone || "",
            nni: c.nni || ""
          };
        });

        setCandidates(mappedData);
      } catch (err) {
        console.error("Erreur lors du chargement des candidats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  // Liste des filières uniques (en excluant les valeurs génériques)
  const filieres = useMemo(() => {
    if (!candidates.length) return ["Toutes les filières"];
    const set = new Set(
      candidates
        .map((c) => c.filiere)
        .filter((f) => f && f !== "Hors domaine" && f !== "Non spécifié")
    );
    return ["Toutes les filières", ...Array.from(set).sort()];
  }, [candidates]);

  /**
   * Filtre les candidats par filière et par terme de recherche
   * (nom, téléphone ou NNI)
   */
  const filterCandidates = useCallback((filiere, searchTerm) => {
    return candidates.filter((c) => {
      const matchFiliere =
        !filiere || filiere === "Toutes les filières" || c.filiere === filiere;

      const term = searchTerm.trim().toLowerCase();
      
      // Normalisation du téléphone pour la recherche (on ne garde que les chiffres)
      const cleanTerm = term.replace(/\D/g, "");
      const cleanPhone = (c.telephone || "").replace(/\D/g, "");

      const matchSearch =
        !term ||
        (c.nom && c.nom.toLowerCase().includes(term)) ||
        (cleanPhone && cleanTerm && cleanPhone.includes(cleanTerm)) ||
        (c.telephone && c.telephone.toLowerCase().includes(term)) || // Toujours garder le match exact/partiel sur le texte brut
        (c.nni && c.nni.includes(term));

      return matchFiliere && matchSearch;
    });
  }, [candidates]);

  /**
   * Trouve un candidat par son id
   */
  const getCandidatById = useCallback((id) => {
    if (!id || !candidates.length) return null;
    return candidates.find((c) => {
      return String(c.id).trim() === String(id).trim();
    }) || null;
  }, [candidates]);

  return { candidates, filieres, filterCandidates, getCandidatById, loading, error };
}
