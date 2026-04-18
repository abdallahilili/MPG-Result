import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDebounce - Hook pour débouncer une valeur
 * Utile pour éviter trop d'appels API lors de la saisie dans un champ de recherche
 * 
 * @param {any} value - La valeur à débouncer
 * @param {number} delay - Délai en millisecondes (défaut: 300ms)
 * @returns {any} La valeur débouncée
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     performSearch(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timer qui met à jour la valeur après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Hook pour débouncer une fonction callback
 * Utile pour limiter la fréquence d'exécution d'une fonction
 * 
 * @param {Function} callback - La fonction à débouncer
 * @param {number} delay - Délai en millisecondes
 * @param {Array} dependencies - Dépendances pour recréer le callback
 * @returns {Function} La fonction débouncée
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (term) => fetchResults(term),
 *   500,
 *   []
 * );
 */
export function useDebouncedCallback(callback, delay = 300, dependencies = []) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...dependencies]
  );

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * useThrottle - Hook pour throttler une valeur
 * Garantit qu'une valeur ne sera mise à jour qu'une fois par intervalle
 * 
 * @param {any} value - La valeur à throttler
 * @param {number} interval - Intervalle minimum entre les mises à jour (ms)
 * @returns {any} La valeur throttlée
 * 
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScroll = useThrottle(scrollPosition, 100);
 */
export function useThrottle(value, interval = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * useThrottledCallback - Hook pour throttler une fonction callback
 * 
 * @param {Function} callback - La fonction à throttler
 * @param {number} interval - Intervalle minimum entre les appels (ms)
 * @param {Array} dependencies - Dépendances pour recréer le callback
 * @returns {Function} La fonction throttlée
 */
export function useThrottledCallback(callback, interval = 300, dependencies = []) {
  const lastRan = useRef(Date.now());

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now();
      
      if (now - lastRan.current >= interval) {
        callback(...args);
        lastRan.current = now;
      }
    },
    [callback, interval, ...dependencies]
  );

  return throttledCallback;
}

/**
 * useSearchWithDebounce - Hook combiné pour la recherche avec debounce
 * Gère à la fois la valeur de recherche et son état de chargement
 * 
 * @param {number} delay - Délai de debounce (défaut: 300ms)
 * @returns {Object} - { searchTerm, setSearchTerm, debouncedSearchTerm, isSearching }
 * 
 * @example
 * const { searchTerm, setSearchTerm, debouncedSearchTerm, isSearching } = useSearchWithDebounce(500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useSearchWithDebounce(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching
  };
}

/**
 * useDebouncedState - Hook qui combine useState et useDebounce
 * Retourne à la fois la valeur immédiate et la valeur débouncée
 * 
 * @param {any} initialValue - Valeur initiale
 * @param {number} delay - Délai de debounce
 * @returns {Array} - [immediateValue, setImmediateValue, debouncedValue]
 */
export function useDebouncedState(initialValue, delay = 300) {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const debouncedValue = useDebounce(immediateValue, delay);

  return [immediateValue, setImmediateValue, debouncedValue];
}