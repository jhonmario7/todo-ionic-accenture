import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})

export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Metodos para gestionar el storage

  /* establece/guarda un valor en el storage */
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  /* obtiene un valor del storage */
  public async get(key: string) {
    return await this._storage?.get(key);
  }

  /* elimina un valor del storage */
  public async remove(key: string) {
    await this._storage?.remove(key);
  }

  /* limpia todo el storage */
  public async clear() {
    await this._storage?.clear();
  }
}