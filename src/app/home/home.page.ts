import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
    IonicModule
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
    private themeService: ThemeService
  ) { }

  ngOnInit() {
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
}
