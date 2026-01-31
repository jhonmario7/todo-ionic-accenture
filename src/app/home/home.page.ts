import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { TasksService } from '../core/services/tasks.service';
import { CategoriesService } from '../core/services/categories.service';
import { Task } from '../core/models/task.model';
import { Category } from '../core/models/category.model';
import { ThemeService } from '../core/services/theme.service';
import { RemoteConfigService } from '../core/services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  categories: Category[] = [];

  // Para el formulario de agregar tarea
  newTaskTitle: string = '';
  selectedCategoryId: string = 'personal';

  // Para filtro
  filterCategoryId: string = 'all';

  // Para categorías
  categoriesEnabled: boolean = true;

  constructor(
    private tasksService: TasksService,
    private categoriesService: CategoriesService,
    private themeService: ThemeService,
    private alertController: AlertController,
    private remoteConfigService: RemoteConfigService
  ) { }

  async ngOnInit() {
    // Obtener valor del feature flag
    this.categoriesEnabled = await this.remoteConfigService.getCategoriesEnabled();
    console.log('Feature flag - Categories enabled:', this.categoriesEnabled);
  
    // Suscribirse a los cambios de tareas
    this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  
    // Suscribirse a los cambios de categorías
    this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;
      if (categories.length > 0 && !this.selectedCategoryId) {
        this.selectedCategoryId = categories[0].id;
      }
    });
  }
  

 
/**
 * @method getFormattedDate
 * @funcionalidad Se encarga de formatear la fecha
 * @param timestamp - El timestamp de la fecha
 * @returns string
 */
getFormattedDate(timestamp: number): string {
  const date = new Date(timestamp);
  
  // Obtener partes de la fecha
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  };
  
  const parts = new Intl.DateTimeFormat('es-ES', options).formatToParts(date);
  
  const weekday = parts.find(p => p.type === 'weekday')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  const year = parts.find(p => p.type === 'year')?.value || '';
  
  // Capitalizar primera letra
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  return `${capitalize(weekday)}, ${capitalize(month)} ${day}, ${year}`;
}

  /**
   * @method addTask
   * @funcionalidad Se encarga de agregar una nueva tarea
   * @returns Promise<void>
   */
  async addTask() {
    if (this.newTaskTitle.trim().length > 0) {
      await this.tasksService.addTask(this.newTaskTitle, this.selectedCategoryId);
      this.newTaskTitle = ''; // limpiar input
    }
  }

  /**
   * @method toggleTask
   * @funcionalidad Se encarga de alternar el estado de completado de una tarea
   * @param taskId - El ID de la tarea
   * @returns Promise<void>
   */
  async toggleTask(taskId: string) {
    await this.tasksService.toggleComplete(taskId);
  }

  /**
   * @method deleteTask
   * @funcionalidad Se encarga de eliminar una tarea
   * @param taskId - El ID de la tarea
   * @returns Promise<void>
   */
  async deleteTask(taskId: string) {
    await this.tasksService.deleteTask(taskId);
  }

  /**
   * @method confirmDelete
   * @funcionalidad Se encarga de confirmar la eliminación de una tarea
   * @param taskId - El ID de la tarea
   * @returns Promise<void>
   */
  async confirmDelete(taskId: string) {
    const alert = await this.alertController.create({
      header: 'ELIMINAR TAREA:',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'danger',
          handler: () => {
            this.deleteTask(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * @method getFilteredTasks
   * @funcionalidad Se encarga de obtener las tareas filtradas
   * @returns Task[]
   */
  getFilteredTasks(): Task[] {
    if (this.filterCategoryId === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(t => t.categoryId === this.filterCategoryId);
  }

  /**
   * @method getCategoryName
   * @funcionalidad Se encarga de obtener el nombre de una categoría por ID
   * @param categoryId - El ID de la categoría
   * @returns string
   */
  getCategoryName(categoryId: string): string {
    const category = this.categoriesService.getCategoryById(categoryId);
    return category ? category.name : 'Sin categoría';
  }

  /**
   * @method trackByTaskId
   * @funcionalidad Se encarga de optimizar el renderizado de las tareas
   * @param index - El índice de la tarea
   * @param task - La tarea
   * @returns string
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /**
   * @method toggleTheme
   * @funcionalidad Se encarga de alternar el tema claro/oscuro
   */
  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  /**
   * @method isDarkMode
   * @funcionalidad Se encarga de obtener el estado del tema
   * @returns boolean
   */
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  /**
   * @method getCategoryColor
   * @funcionalidad Se encarga de obtener el color de una categoría por ID
   * @param categoryId - El ID de la categoría
   * @returns string
   */
  getCategoryColor(categoryId: string): string {
    const category = this.categoriesService.getCategoryById(categoryId);
    return category?.color || '#999999'; // Color gris por defecto si no tiene
  }
}
