import { useState, useCallback, Component } from 'react';

/**
 * Error Handler - Gestion centralisée des erreurs
 * - Classification des erreurs par type
 * - Messages d'erreur contextuels et actionnables
 * - Support du retry pour les erreurs temporaires
 */

/**
 * Classe d'erreur personnalisée pour l'application
 */
export class AppError extends Error {
  constructor(message, type, originalError = null, retryable = false) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      retryable: this.retryable,
      timestamp: this.timestamp,
      originalError: this.originalError?.message
    };
  }
}

/**
 * Types d'erreurs
 */
export const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  DATABASE: 'DATABASE_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Gestionnaire d'erreurs Supabase
 */
export function handleSupabaseError(error) {
  // Erreur réseau (offline, DNS, etc.)
  if (!navigator.onLine) {
    throw new AppError(
      'Pas de connexion internet. Vérifiez votre réseau et réessayez.',
      ErrorType.NETWORK,
      error,
      true
    );
  }
  
  if (error.message?.includes('fetch') || 
      error.message?.includes('NetworkError') ||
      error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
    throw new AppError(
      'Impossible de contacter le serveur. Vérifiez votre connexion.',
      ErrorType.NETWORK,
      error,
      true
    );
  }
  
  // Erreurs Supabase/PostgreSQL
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        throw new AppError(
          'La table demandée n\'existe pas. Vérifiez la configuration de la base de données.',
          ErrorType.DATABASE,
          error,
          false
        );
      
      case 'PGRST301':
        throw new AppError(
          'Requête invalide. Contactez le support technique.',
          ErrorType.DATABASE,
          error,
          false
        );
      
      case '42P01':
        throw new AppError(
          'Table ou vue introuvable dans la base de données.',
          ErrorType.DATABASE,
          error,
          false
        );
      
      case '42501':
        throw new AppError(
          'Permissions insuffisantes pour accéder à cette ressource.',
          ErrorType.PERMISSION,
          error,
          false
        );
      
      case '23505':
        throw new AppError(
          'Cette entrée existe déjà dans la base de données.',
          ErrorType.VALIDATION,
          error,
          false
        );
      
      case '23503':
        throw new AppError(
          'Référence invalide dans la base de données.',
          ErrorType.VALIDATION,
          error,
          false
        );
      
      default:
        throw new AppError(
          `Erreur de base de données (${error.code}): ${error.message}`,
          ErrorType.DATABASE,
          error,
          false
        );
    }
  }
  
  // Erreurs d'authentification
  if (error.message?.includes('JWT') || 
      error.message?.includes('token') ||
      error.message?.includes('unauthorized')) {
    throw new AppError(
      'Session expirée. Veuillez recharger la page.',
      ErrorType.AUTH,
      error,
      false
    );
  }
  
  // Timeout
  if (error.message?.includes('timeout') || error.name === 'AbortError') {
    throw new AppError(
      'La requête a pris trop de temps. Réessayez dans quelques instants.',
      ErrorType.TIMEOUT,
      error,
      true
    );
  }
  
  // Erreur générique
  throw new AppError(
    error.message || 'Une erreur inattendue est survenue.',
    ErrorType.UNKNOWN,
    error,
    true
  );
}

/**
 * Formater un message d'erreur pour l'affichage utilisateur
 */
export function formatErrorMessage(error) {
  if (error instanceof AppError) {
    return {
      title: getErrorTitle(error.type),
      message: error.message,
      action: getErrorAction(error),
      type: error.type,
      retryable: error.retryable
    };
  }
  
  return {
    title: 'Erreur',
    message: error.message || 'Une erreur inattendue est survenue.',
    action: 'Réessayer',
    type: ErrorType.UNKNOWN,
    retryable: true
  };
}

/**
 * Obtenir le titre de l'erreur selon son type
 */
function getErrorTitle(type) {
  switch (type) {
    case ErrorType.NETWORK:
      return '📡 Problème de connexion';
    case ErrorType.DATABASE:
      return '💾 Erreur de base de données';
    case ErrorType.AUTH:
      return '🔐 Session expirée';
    case ErrorType.VALIDATION:
      return '⚠️ Données invalides';
    case ErrorType.NOT_FOUND:
      return '🔍 Ressource introuvable';
    case ErrorType.PERMISSION:
      return '🚫 Accès refusé';
    case ErrorType.TIMEOUT:
      return '⏱️ Délai dépassé';
    default:
      return '❌ Erreur';
  }
}

/**
 * Obtenir l'action suggérée selon l'erreur
 */
function getErrorAction(error) {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Vérifier la connexion';
    case ErrorType.AUTH:
      return 'Recharger la page';
    case ErrorType.TIMEOUT:
      return 'Réessayer';
    case ErrorType.DATABASE:
    case ErrorType.PERMISSION:
      return 'Contacter le support';
    default:
      return error.retryable ? 'Réessayer' : 'OK';
  }
}

/**
 * Hook React pour gérer les erreurs
 */
export function useErrorHandler() {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((err) => {
    console.error('Error handled:', err);
    
    let appError;
    
    if (err instanceof AppError) {
      appError = err;
    } else {
      try {
        handleSupabaseError(err);
      } catch (e) {
        appError = e;
      }
    }
    
    setError(appError);
    
    // Envoyer à un service de tracking si configuré
    if (window.Sentry && appError.type !== ErrorType.NETWORK) {
      window.Sentry.captureException(appError.originalError || appError);
    }
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const retry = useCallback(async (fn) => {
    clearError();
    try {
      await fn();
    } catch (err) {
      handleError(err);
    }
  }, [clearError, handleError]);
  
  return { 
    error, 
    handleError, 
    clearError, 
    retry,
    hasError: error !== null,
    errorMessage: error ? formatErrorMessage(error) : null
  };
}

/**
 * Composant ErrorBoundary React
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => {
          this.setState({ hasError: false, error: null });
        });
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-bg">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-card text-center">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold text-[#1c1917] mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-sm text-muted mb-6">
              L'application a rencontré un problème inattendu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

/**
 * Logger d'erreurs pour le développement
 */
export class ErrorLogger {
  static errors = [];
  static maxErrors = 50;
  
  static log(error) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      type: error.type || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      online: navigator.onLine
    };
    
    this.errors.push(errorData);
    
    // Limiter la taille du tableau
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    // Log en console en mode développement
    if (import.meta.env.DEV) {
      console.group('🔴 Error Logged');
      console.error(errorData);
      console.groupEnd();
    }
    
    return errorData;
  }
  
  static getErrors() {
    return [...this.errors];
  }
  
  static clear() {
    this.errors = [];
  }
  
  static export() {
    return JSON.stringify(this.errors, null, 2);
  }
}