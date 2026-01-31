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

  /**
   * @method loadCategories
   * @funcionalidad Se encarga de cargar las categorías desde el storage al iniciar
   * @returns Promise<void>
   */
  async loadCategories() {
    const categories = await this.storageService.get(this.STORAGE_KEY);
    
    if (!categories || categories.length === 0) {
      await this.initializeDefaultCategories();
    } else {
      this.categoriesSubject.next(categories);
    }
  }

  /**
   * @method initializeDefaultCategories
   * @funcionalidad Se encarga de inicializar categorías por defecto si no hay ninguna
   * @returns Promise<void>
   */
  private async initializeDefaultCategories() {
    const defaultCategories: Category[] = [
      { id: 'personal', name: 'Personal', color: '#3880ff' },
      { id: 'trabajo', name: 'Trabajo', color: '#10dc60' },
      { id: 'compras', name: 'Compras', color: '#f4a942' }
    ];
    await this.saveCategories(defaultCategories);
  }

  /**
   * @method saveCategories
   * @funcionalidad Se encarga de guardar las categorías en el storage
   * @param categories - Las categorías a guardar
   * @returns Promise<void>
   */
  private async saveCategories(categories: Category[]) {
    await this.storageService.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  /**
   * @method getCategories
   * @funcionalidad Se encarga de obtener todas las categorías (snapshot actual)
   * @returns Category[]
   */
  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  /**
   * @method getCategoryById
   * @funcionalidad Se encarga de obtener una categoría por ID
   * @param id - El ID de la categoría
   * @returns Category | undefined
   */
  getCategoryById(id: string): Category | undefined {
    return this.getCategories().find(c => c.id === id);
  }

  /**
   * @method addCategory
   * @funcionalidad Se encarga de agregar una nueva categoría
   * @param name - El nombre de la categoría
   * @param color - El color de la categoría
   * @returns Promise<void>
   */
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

  /**
   * @method updateCategory
   * @funcionalidad Se encarga de actualizar una categoría existente
   * @param updatedCategory - La categoría actualizada
   * @returns Promise<void>
   */
  async updateCategory(updatedCategory: Category) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      await this.saveCategories(categories);
    }
  }

  /**
   * @method deleteCategory
   * @funcionalidad Se encarga de eliminar una categoría
   * @param categoryId - El ID de la categoría
   * @returns Promise<void>
   */
  async deleteCategory(categoryId: string) {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    await this.saveCategories(filteredCategories);
  }
}
