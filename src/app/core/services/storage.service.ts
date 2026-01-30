import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})

export class StorageService {

  private _storage: Storage | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init(); // Inicializa el storage
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ensureInitialized() {
    await this.initPromise; 
  }

  // Metodos para gestionar el storage

  /* Establece/guarda un valor en el storage */
  public async set(key: string, value: any) {
    await this.ensureInitialized();
    await this._storage?.set(key, value);
  }

  /* Obtiene un valor del storage */
  public async get(key: string) {
    await this.ensureInitialized();
    return await this._storage?.get(key);
  }

  /* Elimina un valor del storage */
  public async remove(key: string) {
    await this.ensureInitialized();
    await this._storage?.remove(key);
  }


  /* Limpia todo el storage */
  public async clear() {
    await this.ensureInitialized();
    await this._storage?.clear();
  }
}