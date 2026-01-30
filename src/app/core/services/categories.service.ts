import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  // Guarda el estado actual - notifica cambios
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  
  // Observable publico para suscripciones
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private readonly STORAGE_KEY = 'categories';

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  /* Carga las categorías desde el storage al iniciar */
  async loadCategories() {
    const categories = await this.storageService.get(this.STORAGE_KEY);
    
    if (!categories || categories.length === 0) {
      await this.initializeDefaultCategories();
    } else {
      this.categoriesSubject.next(categories);
    }
  }

  /* Inicializa categorías por defecto si no hay ninguna */
  private async initializeDefaultCategories() {
    const defaultCategories: Category[] = [
      { id: 'personal', name: 'Personal', color: '#3880ff' },
      { id: 'trabajo', name: 'Trabajo', color: '#10dc60' },
      { id: 'compras', name: 'Compras', color: '#f4a942' }
    ];
    await this.saveCategories(defaultCategories);
  }

  /* Guarda las categorías en el storage */
  private async saveCategories(categories: Category[]) {
    await this.storageService.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  /* Obtiene todas las categorías (snapshot actual) */
  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  /* Obtiene una categoría por ID */
  getCategoryById(id: string): Category | undefined {
    return this.getCategories().find(c => c.id === id);
  }

  /* Agrega una nueva categoría */
  async addCategory(name: string, color?: string) {
    const categories = this.getCategories();
    const newCategory: Category = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color || '#999999'
    };
    categories.push(newCategory);
    await this.saveCategories(categories);
  }

  /* Actualiza una categoría existente */
  async updateCategory(updatedCategory: Category) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      await this.saveCategories(categories);
    }
  }

  /* Elimina una categoría */
  async deleteCategory(categoryId: string) {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    await this.saveCategories(filteredCategories);
  }
}
