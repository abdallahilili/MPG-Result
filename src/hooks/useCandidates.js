import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { CacheManager } from "../lib/cache";

const cache = new CacheManager('candidates_all', 10 * 60 * 1000); // 10 min cache for full list

/**
 * Mapping des candidats
 */
function mapCandidat(c) {
  let mappedStatut = "rejete";
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
}

/**
 * useCandidates - VERSION SIMPLIFIÉE (Sans pagination serveur)
 * Charge tous les candidats (en gérant le dépassement des 1000 lignes)
 */
export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Essayer le cache en premier
      const cached = cache.get('all');
      if (cached) {
        setCandidates(cached);
        setLoading(false);
      }

      // 2. Fetch par blocs de 1000 (limite Supabase)
      let allData = [];
      let page = 0;
      let hasMore = true;
      const CHUNK_SIZE = 1000;

      while (hasMore) {
        const from = page * CHUNK_SIZE;
        const to = from + CHUNK_SIZE - 1;

        const { data, error: fetchError } = await supabase
          .from("v_candidates_result")
          .select("*")
          .range(from, to)
          .order('rang', { ascending: true });

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          hasMore = data.length === CHUNK_SIZE;
          page++;
        } else {
          hasMore = false;
        }
      }

      const mappedData = allData.map(mapCandidat);
      
      setCandidates(mappedData);
      cache.set('all', mappedData);
      
    } catch (err) {
      console.error("Erreur chargement candidats:", err);
      if (!navigator.onLine) {
        setError({ message: "Mode hors ligne. Données peut-être incomplètes.", type: "network" });
      } else {
        setError({ message: err.message || "Erreur de chargement", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCandidates();
  }, [fetchAllCandidates]);

  const filieres = useMemo(() => {
    if (!candidates.length) return ["Toutes les filières"];
    const set = new Set(
      candidates
        .map((c) => c.filiere)
        .filter((f) => f && f !== "Hors domaine" && f !== "Non spécifié")
    );
    return ["Toutes les filières", ...Array.from(set).sort()];
  }, [candidates]);

  const filterCandidates = useCallback((filiere, searchTerm) => {
    return candidates.filter((c) => {
      const matchFiliere =
        !filiere || filiere === "Toutes les filières" || c.filiere === filiere;

      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchFiliere;

      const cleanTerm = term.replace(/\D/g, "");
      const cleanPhone = (c.telephone || "").replace(/\D/g, "");

      const matchSearch =
        (c.nom && c.nom.toLowerCase().includes(term)) ||
        (cleanPhone && cleanTerm && cleanPhone.includes(cleanTerm)) ||
        (c.telephone && c.telephone.toLowerCase().includes(term)) ||
        (c.nni && c.nni.includes(term)) ||
        (c.email_addr && c.email_addr.toLowerCase().includes(term));

      return matchFiliere && matchSearch;
    });
  }, [candidates]);

  const getCandidatById = useCallback((id) => {
    if (!id || !candidates.length) return null;
    return candidates.find((c) => String(c.id) === String(id)) || null;
  }, [candidates]);

  const getCandidatDetailById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const { data, error: fetchError } = await supabase
        .from("candidates")
        .select("id, score_niveau, score_dossier, score_experience, score_motivation, score_adequation, score_disponibilite, score_total, specialty, etat")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.warn("Erreur détails:", err.message);
      return null;
    }
  }, []);

  return { 
    candidates, 
    filieres, 
    filterCandidates, 
    getCandidatById, 
    getCandidatDetailById, 
    loading, 
    error,
    retry: fetchAllCandidates
  };
}