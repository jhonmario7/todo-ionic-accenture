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

  /**
   * @method initializeRemoteConfig
   * @funcionalidad Se encarga de inicializar Firebase y Remote Config
   * @returns Promise<void>
   */
  private async initializeRemoteConfig() {
    try {
      /* Inicializar Firebase */
      const app = initializeApp(firebaseConfig);
      
      /* Obtener instancia de Remote Config */
      this.remoteConfig = getRemoteConfig(app);
      
      /* Configurar tiempo de caché (en producción usar 12 horas, en dev 0 para testing) */
      this.remoteConfig.settings = {
        minimumFetchIntervalMillis: 0, 
        fetchTimeoutMillis: 60000 
      };

      /* Valores por defecto (si Firebase no está disponible) */
      this.remoteConfig.defaultConfig = {
        enableCategories: 'true'
      };

      /* Obtener valores del servidor */
      await fetchAndActivate(this.remoteConfig);
      
      this.initialized = true;
      console.log('Remote Config inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
    }
  }

  /**
   * @method getCategoriesEnabled
   * @funcionalidad Se encarga de obtener el valor del parámetro enableCategories
   * @returns Promise<boolean>
   */
  async getCategoriesEnabled(): Promise<boolean> {
    if (!this.initialized) {
      await this.waitForInitialization();
    }

    try {
      const value = getValue(this.remoteConfig, 'enableCategories');
      return value.asString() === 'true';
    } catch (error) {
      console.error('Error al obtener enableCategories:', error);
      return true; 
    }
  }

  /**
   * @method waitForInitialization
   * @funcionalidad Se encarga de esperar a que Remote Config esté inicializado
   * @returns Promise<void>
   */
  private async waitForInitialization(): Promise<void> {
    let attempts = 0;
    while (!this.initialized && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  /**
   * @method refresh
   * @funcionalidad Se encarga de forzar refetch de valores (útil para testing)
   * @returns Promise<void>
   */
  async refresh(): Promise<void> {
    if (this.remoteConfig) {
      await fetchAndActivate(this.remoteConfig);
    }
  }
}
