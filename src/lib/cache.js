import { useRef, useCallback } from 'react';

/**
 * CacheManager - Gestion du cache localStorage
 * - Support du versioning pour invalider automatiquement les anciennes versions
 * - TTL (Time To Live) configurable
 * - Gestion automatique des erreurs localStorage (quota dépassé, etc.)
 */

const CACHE_PREFIX = 'eetfp_';
const CACHE_VERSION = 'v1';

export class CacheManager {
  constructor(namespace, ttl = 5 * 60 * 1000) {
    this.namespace = `${CACHE_PREFIX}${CACHE_VERSION}_${namespace}`;
    this.ttl = ttl;
  }
  
  /**
   * Sauvegarder une valeur dans le cache
   */
  set(key, value) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      const serialized = JSON.stringify(item);
      localStorage.setItem(`${this.namespace}_${key}`, serialized);
      
      return true;
    } catch (error) {
      // Gestion du quota dépassé
      if (error.name === 'QuotaExceededError') {
        console.warn('Cache quota exceeded, clearing old entries...');
        this.clearOldEntries();
        
        // Réessayer après le nettoyage
        try {
          const item = { value, timestamp: Date.now(), version: CACHE_VERSION };
          localStorage.setItem(`${this.namespace}_${key}`, JSON.stringify(item));
          return true;
        } catch (retryError) {
          console.error('Cache write failed even after cleanup:', retryError);
          return false;
        }
      }
      
      console.warn('Cache write failed:', error);
      return false;
    }
  }
  
  /**
   * Récupérer une valeur du cache
   */
  get(key) {
    try {
      const item = localStorage.getItem(`${this.namespace}_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const { value, timestamp, version } = parsed;
      
      // Vérifier la version
      if (version !== CACHE_VERSION) {
        console.log(`Cache version mismatch for ${key}, invalidating`);
        this.delete(key);
        return null;
      }
      
      // Vérifier l'expiration
      const age = Date.now() - timestamp;
      if (age > this.ttl) {
        console.log(`Cache expired for ${key} (age: ${Math.round(age / 1000)}s)`);
        this.delete(key);
        return null;
      }
      
      return value;
    } catch (error) {
      console.warn('Cache read failed:', error);
      // Supprimer l'entrée corrompue
      this.delete(key);
      return null;
    }
  }
  
  /**
   * Supprimer une entrée du cache
   */
  delete(key) {
    try {
      localStorage.removeItem(`${this.namespace}_${key}`);
      return true;
    } catch (error) {
      console.warn('Cache delete failed:', error);
      return false;
    }
  }
  
  /**
   * Vider tout le cache pour ce namespace
   */
  clear() {
    try {
      const keysToDelete = [];
      
      // Parcourir toutes les clés du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.namespace)) {
          keysToDelete.push(key);
        }
      }
      
      // Supprimer les clés identifiées
      keysToDelete.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleared ${keysToDelete.length} cache entries for ${this.namespace}`);
      return true;
    } catch (error) {
      console.warn('Cache clear failed:', error);
      return false;
    }
  }
  
  /**
   * Nettoyer les anciennes entrées (expirées ou anciennes versions)
   */
  clearOldEntries() {
    try {
      const now = Date.now();
      const keysToDelete = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(CACHE_PREFIX)) continue;
        
        try {
          const item = localStorage.getItem(key);
          if (!item) continue;
          
          const parsed = JSON.parse(item);
          const { timestamp, version } = parsed;
          
          // Supprimer si version obsolète ou expiré
          const isExpired = now - timestamp > this.ttl;
          const isOldVersion = version !== CACHE_VERSION;
          
          if (isExpired || isOldVersion) {
            keysToDelete.push(key);
          }
        } catch (error) {
          // Supprimer les entrées corrompues
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleaned up ${keysToDelete.length} old cache entries`);
      return keysToDelete.length;
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
      return 0;
    }
  }
  
  /**
   * Obtenir la taille utilisée par le cache (approximatif)
   */
  getSize() {
    try {
      let size = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.namespace)) {
          const item = localStorage.getItem(key);
          if (item) {
            size += item.length + key.length;
          }
        }
      }
      
      // Convertir en KB
      return Math.round(size / 1024);
    } catch (error) {
      console.warn('Cache size calculation failed:', error);
      return 0;
    }
  }
  
  /**
   * Vérifier si une clé existe dans le cache (sans tenir compte de l'expiration)
   */
  has(key) {
    return localStorage.getItem(`${this.namespace}_${key}`) !== null;
  }
  
  /**
   * Obtenir toutes les clés du cache pour ce namespace
   */
  keys() {
    try {
      const keys = [];
      const prefix = `${this.namespace}_`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        }
      }
      
      return keys;
    } catch (error) {
      console.warn('Failed to get cache keys:', error);
      return [];
    }
  }
}

/**
 * Hook React pour utiliser le cache
 */
export function useCache(namespace, ttl) {
  const cacheRef = useRef(null);
  
  if (!cacheRef.current) {
    cacheRef.current = new CacheManager(namespace, ttl);
  }
  
  const cache = cacheRef.current;
  
  const set = useCallback((key, value) => cache.set(key, value), [cache]);
  const get = useCallback((key) => cache.get(key), [cache]);
  const remove = useCallback((key) => cache.delete(key), [cache]);
  const clear = useCallback(() => cache.clear(), [cache]);
  
  return { set, get, remove, clear, cache };
}

/**
 * Nettoyer automatiquement le cache au démarrage de l'application
 * Appeler dans main.jsx ou App.jsx
 */
export function initCacheCleanup() {
  try {
    // Créer une instance temporaire pour le nettoyage
    const cleaner = new CacheManager('cleanup');
    const removed = cleaner.clearOldEntries();
    
    if (removed > 0) {
      console.log(`✓ Cache startup cleanup: removed ${removed} expired entries`);
    }
    
    return true;
  } catch (error) {
    console.warn('Cache cleanup failed:', error);
    return false;
  }
}

/**
 * Statistiques globales du cache
 */
export function getCacheStats() {
  try {
    let totalSize = 0;
    let totalEntries = 0;
    const namespaces = new Map();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(CACHE_PREFIX)) continue;
      
      const item = localStorage.getItem(key);
      if (!item) continue;
      
      totalEntries++;
      totalSize += item.length + key.length;
      
      // Extraire le namespace
      const match = key.match(new RegExp(`${CACHE_PREFIX}${CACHE_VERSION}_([^_]+)`));
      if (match) {
        const ns = match[1];
        namespaces.set(ns, (namespaces.get(ns) || 0) + 1);
      }
    }
    
    return {
      totalEntries,
      totalSizeKB: Math.round(totalSize / 1024),
      namespaces: Object.fromEntries(namespaces)
    };
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
    return null;
  }
}