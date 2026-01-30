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

  constructor(
    private tasksService: TasksService,
    private categoriesService: CategoriesService,
    private themeService: ThemeService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });

    this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;
      if (categories.length > 0 && !this.selectedCategoryId) {
        this.selectedCategoryId = categories[0].id;
      }
    });
  }

/* Formatear fecha: Lunes, Enero, 30, 2026 */
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

  /* Agregar nueva tarea */
  async addTask() {
    if (this.newTaskTitle.trim().length > 0) {
      await this.tasksService.addTask(this.newTaskTitle, this.selectedCategoryId);
      this.newTaskTitle = ''; // limpiar input
    }
  }

  /* Alternar completado de tarea */
  async toggleTask(taskId: string) {
    await this.tasksService.toggleComplete(taskId);
  }

  /* Eliminar tarea */
  async deleteTask(taskId: string) {
    await this.tasksService.deleteTask(taskId);
  }

  /* Confirmar eliminación */
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

  /* Obtener tareas filtradas */
  getFilteredTasks(): Task[] {
    if (this.filterCategoryId === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(t => t.categoryId === this.filterCategoryId);
  }

  /* Obtener nombre de categoría por ID */
  getCategoryName(categoryId: string): string {
    const category = this.categoriesService.getCategoryById(categoryId);
    return category ? category.name : 'Sin categoría';
  }

  /* TrackBy para optimización de renderizado */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /* Toggle tema claro/oscuro */
  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  /* Obtener estado del tema */
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  /* Obtener color de categoría por ID */
  getCategoryColor(categoryId: string): string {
    const category = this.categoriesService.getCategoryById(categoryId);
    return category?.color || '#999999'; // Color gris por defecto si no tiene
  }
}
