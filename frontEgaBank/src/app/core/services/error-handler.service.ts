import { Injectable } from '@angular/core';

export interface ErrorInfo {
  message: string;
  type: 'error' | 'warning' | 'info';
  details?: string;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleError(error: any, context: string = ''): ErrorInfo {
    console.error(`❌ Erreur dans ${context}:`, error);
    
    // Erreurs HTTP
    if (error.status) {
      return this.handleHttpError(error, context);
    }
    
    // Erreurs réseau
    if (error.message?.includes('NetworkError') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      return {
        message: 'Erreur de connexion',
        type: 'error',
        details: 'Vérifiez votre connexion internet et réessayez.',
        action: 'Réessayer'
      };
    }
    
    // Erreurs de validation
    if (error.message?.includes('required') || error.message?.includes('Invalid')) {
      return {
        message: 'Données invalides',
        type: 'warning',
        details: 'Veuillez vérifier les informations saisies.',
        action: 'Corriger les champs'
      };
    }
    
    // Erreurs par défaut
    return {
      message: error.error?.message || error.message || 'Une erreur est survenue',
      type: 'error',
      details: 'Veuillez réessayer plus tard.',
      action: 'Réessayer'
    };
  }
  
  private handleHttpError(error: any, context: string): ErrorInfo {
    const status = error.status;
    const errorData = error.error;
    
    switch (status) {
      case 400:
        return {
          message: 'Données invalides',
          type: 'warning',
          details: errorData?.message || 'Les informations fournies sont incorrectes.',
          action: 'Corriger les données'
        };
        
      case 401:
        return {
          message: 'Non autorisé',
          type: 'error',
          details: 'Votre session a expiré. Veuillez vous reconnecter.',
          action: 'Se reconnecter'
        };
        
      case 403:
        return {
          message: 'Accès refusé',
          type: 'error',
          details: 'Vous n\'avez pas les permissions nécessaires.',
          action: 'Contacter l\'administrateur'
        };
        
      case 404:
        return {
          message: 'Ressource introuvable',
          type: 'error',
          details: 'La ressource demandée n\'existe pas.',
          action: 'Vérifier l\'URL'
        };
        
      case 409:
        return {
          message: 'Conflit de données',
          type: 'warning',
          details: errorData?.message || 'Les données existent déjà.',
          action: 'Modifier les données'
        };
        
      case 422:
        return {
          message: 'Erreur de validation',
          type: 'warning',
          details: errorData?.message || 'Les données ne respectent pas le format requis.',
          action: 'Corriger les champs'
        };
        
      case 429:
        return {
          message: 'Trop de tentatives',
          type: 'warning',
          details: 'Veuillez patienter avant de réessayer.',
          action: 'Attendre et réessayer'
        };
        
      case 500:
        return {
          message: 'Erreur serveur',
          type: 'error',
          details: 'Le serveur rencontre un problème technique.',
          action: 'Réessayer plus tard'
        };
        
      case 503:
        return {
          message: 'Service indisponible',
          type: 'error',
          details: 'Le service est temporairement indisponible.',
          action: 'Réessayer plus tard'
        };
        
      default:
        return {
          message: errorData?.message || `Erreur ${status}`,
          type: 'error',
          details: 'Une erreur inattendue est survenue.',
          action: 'Réessayer'
        };
    }
  }
  
  // Messages spécifiques par contexte
  getAccountError(error: any): ErrorInfo {
    if (error.error?.message?.includes('insufficient')) {
      return {
        message: 'Solde insuffisant',
        type: 'error',
        details: 'Votre solde est insuffisant pour cette opération.',
        action: 'Approvisionner le compte'
      };
    }
    
    if (error.error?.message?.includes('limit')) {
      return {
        message: 'Limite dépassée',
        type: 'warning',
        details: 'Vous avez atteint la limite autorisée.',
        action: 'Contacter votre conseiller'
      };
    }
    
    return this.handleError(error, 'Opération bancaire');
  }
  
  getAuthError(error: any): ErrorInfo {
    if (error.status === 401) {
      return {
        message: 'Session expirée',
        type: 'error',
        details: 'Votre session a expiré. Veuillez vous reconnecter.',
        action: 'Se reconnecter'
      };
    }
    
    if (error.error?.message?.includes('credentials')) {
      return {
        message: 'Identifiants incorrects',
        type: 'error',
        details: 'Email ou mot de passe incorrect.',
        action: 'Vérifier vos identifiants'
      };
    }
    
    return this.handleError(error, 'Authentification');
  }
}
