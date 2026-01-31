import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})

export class StorageService {

  private _storage: Storage | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init(); 
  }

  /**
   * @method init
   * @funcionalidad Se encarga de inicializar el storage
   * @returns Promise<void>
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * @method ensureInitialized
   * @funcionalidad Se encarga de asegurar que el storage esté inicializado
   */
  private async ensureInitialized() {
    await this.initPromise; 
  }

  /**
   * @method set
   * @funcionalidad Se encarga de establecer/guardar un valor en el storage
   * @param key - La clave del valor
   * @param value - El valor a guardar
   */
  public async set(key: string, value: any) {
    await this.ensureInitialized();
    await this._storage?.set(key, value);
  }

  /**
   * @method get
   * @funcionalidad Se encarga de obtener un valor del storage
   * @param key - La clave del valor
   */
  public async get(key: string) {
    await this.ensureInitialized();
    return await this._storage?.get(key);
  }

  /**
   * @method remove
   * @funcionalidad Se encarga de eliminar un valor del storage
   * @param key - La clave del valor
   */
  public async remove(key: string) {
    await this.ensureInitialized();
    await this._storage?.remove(key);
  }


  /**
   * @method clear
   * @funcionalidad Se encarga de limpiar todo el storage
   */
  public async clear() {
    await this.ensureInitialized();
    await this._storage?.clear();
  }
}