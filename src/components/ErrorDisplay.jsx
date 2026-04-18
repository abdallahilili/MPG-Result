import { AlertCircle, Wifi, Database, Lock, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * ErrorDisplay - Composant pour afficher les erreurs de façon élégante
 * - Icônes contextuelles selon le type d'erreur
 * - Actions suggérées (retry, reload, home)
 * - Animations fluides
 */
export default function ErrorDisplay({ error, onRetry, onClear, fullScreen = true }) {
  const navigate = useNavigate();
  
  if (!error) return null;
  
  const errorInfo = getErrorInfo(error);
  
  const containerClass = fullScreen 
    ? "flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
    : "bg-surface border border-border rounded-xl p-6 text-center";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={containerClass}
    >
      {/* Icône */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`mb-6 ${errorInfo.iconColor}`}
      >
        {errorInfo.icon}
      </motion.div>
      
      {/* Titre */}
      <h3 className="text-lg font-bold text-[#1c1917] mb-2">
        {errorInfo.title}
      </h3>
      
      {/* Message */}
      <p className="text-sm text-muted mb-6 max-w-md">
        {error.message || errorInfo.defaultMessage}
      </p>
      
      {/* Message technique (développement uniquement) */}
      {import.meta.env.DEV && error.originalError && (
        <details className="mb-6 text-left max-w-md">
          <summary className="cursor-pointer text-xs text-muted/50 hover:text-muted mb-2">
            Détails techniques
          </summary>
          <pre className="text-[10px] bg-red-50 border border-red-200 rounded-lg p-3 overflow-auto max-h-40 text-red-900">
            {error.originalError.stack || error.originalError.message || JSON.stringify(error.originalError, null, 2)}
          </pre>
        </details>
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Bouton Retry (si l'erreur est retryable) */}
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw size={16} />
            {errorInfo.actionText}
          </button>
        )}
        
        {/* Bouton Reload (pour les erreurs AUTH ou critiques) */}
        {(error.type === 'AUTH_ERROR' || !error.retryable) && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw size={16} />
            Recharger la page
          </button>
        )}
        
        {/* Bouton Home */}
        {!fullScreen && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-surface border border-border text-muted px-5 py-2.5 rounded-lg font-bold hover:bg-bg transition-all"
          >
            <Home size={16} />
            Retour à l'accueil
          </button>
        )}
        
        {/* Bouton Fermer (si onClear fourni) */}
        {onClear && !fullScreen && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 bg-surface border border-border text-muted px-5 py-2.5 rounded-lg font-bold hover:bg-bg transition-all"
          >
            Fermer
          </button>
        )}
      </div>
      
      {/* Indicateur offline */}
      {!navigator.onLine && (
        <div className="mt-6 flex items-center gap-2 text-xs text-muted/70 bg-orange-soft px-3 py-2 rounded-lg">
          <Wifi size={14} />
          Mode hors ligne
        </div>
      )}
    </motion.div>
  );
}

/**
 * Obtenir les informations de présentation selon le type d'erreur
 */
function getErrorInfo(error) {
  const type = error.type || 'UNKNOWN_ERROR';
  
  const configs = {
    NETWORK_ERROR: {
      icon: <Wifi size={48} strokeWidth={1.5} />,
      iconColor: 'text-orange',
      title: 'Problème de connexion',
      defaultMessage: 'Vérifiez votre connexion internet et réessayez.',
      actionText: 'Réessayer'
    },
    DATABASE_ERROR: {
      icon: <Database size={48} strokeWidth={1.5} />,
      iconColor: 'text-red',
      title: 'Erreur de base de données',
      defaultMessage: 'Un problème est survenu lors de l\'accès aux données.',
      actionText: 'Réessayer'
    },
    AUTH_ERROR: {
      icon: <Lock size={48} strokeWidth={1.5} />,
      iconColor: 'text-orange',
      title: 'Session expirée',
      defaultMessage: 'Votre session a expiré. Veuillez recharger la page.',
      actionText: 'Recharger'
    },
    TIMEOUT_ERROR: {
      icon: <AlertCircle size={48} strokeWidth={1.5} />,
      iconColor: 'text-orange',
      title: 'Délai dépassé',
      defaultMessage: 'La requête a pris trop de temps. Réessayez dans quelques instants.',
      actionText: 'Réessayer'
    },
    NOT_FOUND_ERROR: {
      icon: <AlertCircle size={48} strokeWidth={1.5} />,
      iconColor: 'text-muted',
      title: 'Ressource introuvable',
      defaultMessage: 'L\'élément demandé n\'existe pas ou a été supprimé.',
      actionText: 'Retour'
    },
    PERMISSION_ERROR: {
      icon: <Lock size={48} strokeWidth={1.5} />,
      iconColor: 'text-red',
      title: 'Accès refusé',
      defaultMessage: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
      actionText: 'Retour'
    },
    VALIDATION_ERROR: {
      icon: <AlertCircle size={48} strokeWidth={1.5} />,
      iconColor: 'text-orange',
      title: 'Données invalides',
      defaultMessage: 'Les données fournies ne sont pas valides.',
      actionText: 'Corriger'
    },
    UNKNOWN_ERROR: {
      icon: <AlertCircle size={48} strokeWidth={1.5} />,
      iconColor: 'text-red',
      title: 'Erreur inattendue',
      defaultMessage: 'Une erreur inattendue est survenue.',
      actionText: 'Réessayer'
    }
  };
  
  return configs[type] || configs.UNKNOWN_ERROR;
}

/**
 * Composant ErrorToast - Toast notification pour les erreurs non-critiques
 */
export function ErrorToast({ error, onClose }) {
  if (!error) return null;
  
  const errorInfo = getErrorInfo(error);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className="fixed top-6 left-1/2 z-50 max-w-md w-full mx-auto"
    >
      <div className="bg-surface border border-border rounded-xl shadow-card p-4 flex items-start gap-3">
        <div className={errorInfo.iconColor}>
          {errorInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-[#1c1917] mb-1">
            {errorInfo.title}
          </h4>
          <p className="text-xs text-muted">
            {error.message || errorInfo.defaultMessage}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-[#1c1917] transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Composant ErrorBanner - Bannière en haut de page pour les avertissements
 */
export function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-orange-soft border-b border-orange/20 overflow-hidden"
    >
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Wifi size={20} className="text-orange shrink-0" />
          <p className="text-sm text-muted">
            {error.message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted hover:text-[#1c1917] font-bold text-sm shrink-0"
          >
            Fermer
          </button>
        )}
      </div>
    </motion.div>
  );
}