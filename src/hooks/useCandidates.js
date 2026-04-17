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

        // Supabase limite à 1000 lignes par défaut — on pagine pour tout récupérer
        const PAGE_SIZE = 1000;
        let allData = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
          const from = page * PAGE_SIZE;
          const to = from + PAGE_SIZE - 1;

          const { data, error: fetchError } = await supabase
            .from("v_candidates_result")
            .select("*")
            .range(from, to);

          if (fetchError) throw fetchError;

          if (data && data.length > 0) {
            allData = [...allData, ...data];
            hasMore = data.length === PAGE_SIZE; // s'il y a encore une page complète
            page++;
          } else {
            hasMore = false;
          }
        }

        const data = allData;
        if (false) throw new Error(); // garde la structure du bloc catch

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
        // Gestion explicite de l'erreur réseau (ERR_NAME_NOT_RESOLVED / Network Error)
        if (!navigator.onLine || err.message?.includes("fetch") || err.name === "TypeError") {
          setError("Erreur de connexion : Impossible de joindre Supabase (ERR_NAME_NOT_RESOLVED).");
        } else {
          setError(err.message || "Une erreur inattendue est survenue.");
        }
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
   * Trouve un candidat par son id (depuis la liste chargée)
   */
  const getCandidatById = useCallback((id) => {
    if (!id || !candidates.length) return null;
    return candidates.find((c) => {
      return String(c.id).trim() === String(id).trim();
    }) || null;
  }, [candidates]);

  /**
   * Récupère les détails complets d'un candidat (scores partiels) depuis la table candidates
   */
  const getCandidatDetailById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const { data, error: fetchError } = await supabase
        .from("candidates")
        .select("id, score_niveau,score_dossier, score_experience, score_motivation, score_adequation, score_disponibilite, score_total, specialty, etat")
        .eq("id", id)
        .single();
      if (fetchError) {
        // En cas d'erreur de résolution DNS
        if (fetchError.message?.includes("fetch") || !navigator.onLine) {
          throw new Error("ERR_NAME_NOT_RESOLVED");
        }
        console.warn("Scores partiels non disponibles:", fetchError.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("Erreur fetch détails candidat:", err.message);
      return null;
    }
  }, []);

  return { candidates, filieres, filterCandidates, getCandidatById, getCandidatDetailById, loading, error };
}
