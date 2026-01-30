import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { firebaseConfig } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  private remoteConfig: any;
  private initialized = false;

  constructor() {
    this.initializeRemoteConfig();
  }

  /* Inicializa Firebase y Remote Config */
  private async initializeRemoteConfig() {
    try {
      // Inicializar Firebase
      const app = initializeApp(firebaseConfig);
      
      // Obtener instancia de Remote Config
      this.remoteConfig = getRemoteConfig(app);
      
      // Configurar tiempo de caché (en producción usar 12 horas, en dev 0 para testing)
      this.remoteConfig.settings = {
        minimumFetchIntervalMillis: 0, // 0 = sin caché (solo para desarrollo)
        fetchTimeoutMillis: 60000 // 60 segundos de timeout
      };

      // Valores por defecto (si Firebase no está disponible)
      this.remoteConfig.defaultConfig = {
        enableCategories: 'true'
      };

      // Obtener valores del servidor
      await fetchAndActivate(this.remoteConfig);
      
      this.initialized = true;
      console.log('Remote Config inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
    }
  }

  /* Obtener valor del parámetro enableCategories */
  async getCategoriesEnabled(): Promise<boolean> {
    if (!this.initialized) {
      await this.waitForInitialization();
    }

    try {
      const value = getValue(this.remoteConfig, 'enableCategories');
      return value.asString() === 'true';
    } catch (error) {
      console.error('Error al obtener enableCategories:', error);
      return true; // Por defecto habilitado si hay error
    }
  }

  /* Esperar a que Remote Config esté inicializado */
  private async waitForInitialization(): Promise<void> {
    let attempts = 0;
    while (!this.initialized && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  /* Forzar refetch de valores (útil para testing) */
  async refresh(): Promise<void> {
    if (this.remoteConfig) {
      await fetchAndActivate(this.remoteConfig);
    }
  }
}
