import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  /* Guarda el estado actual de las tareas y notifica a los componentes cuando cambian */
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  /* Observable público para que los componentes se suscriban y reciban cambios automáticamente */
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  /* Clave para almacenar las tareas en el storage */
  private readonly STORAGE_KEY = 'tasks'; 

  constructor(private storageService: StorageService) {
    this.loadTasks(); 
  }

  /**
   * @method loadTasks
   * @funcionalidad Se encarga de cargar las tareas desde el storage al iniciar
   * @returns Promise<void>
   */
  async loadTasks() {
    const tasks = await this.storageService.get(this.STORAGE_KEY);
    this.tasksSubject.next(tasks || []); 
  }

  /**
   * @method saveTasks
   * @funcionalidad Se encarga de guardar las tareas en el storage
   * @param tasks - Las tareas a guardar
   * @returns Promise<void>
   */
  private async saveTasks(tasks: Task[]) {
    await this.storageService.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks); 
  }

  /**
   * @method getTasks
   * @funcionalidad Se encarga de obtener todas las tareas (snapshot actual, sin suscripción)
   * @returns Task[]
   */
  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  /**
   * @method addTask
   * @funcionalidad Se encarga de agregar una nueva tarea
   * @param title - El título de la tarea
   * @param categoryId - El ID de la categoría
   * @returns Promise<void>
   */
  async addTask(title: string, categoryId: string) {
    const tasks = this.getTasks();
    const newTask: Task = {
      id: Date.now().toString(), 
      title: title.trim(),
      completed: false,
      categoryId: categoryId,
      createdAt: Date.now()
    };
    tasks.push(newTask); 
    await this.saveTasks(tasks); 
  }

  /**
   * @method updateTask
   * @funcionalidad Se encarga de actualizar una tarea existente
   * @param updatedTask - La tarea actualizada
   * @returns Promise<void>
   */
  async updateTask(updatedTask: Task) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      await this.saveTasks(tasks);
    }
  }

  /**
   * @method toggleComplete
   * @funcionalidad Se encarga de marcar una tarea como completada/pendiente (toggle)
   * @param taskId - El ID de la tarea
   * @returns Promise<void>
   */
  async toggleComplete(taskId: string) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      await this.saveTasks(tasks);
    }
  }

  /**
   * @method deleteTask
   * @funcionalidad Se encarga de eliminar una tarea
   * @param taskId - El ID de la tarea
   * @returns Promise<void>
   */
  async deleteTask(taskId: string) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await this.saveTasks(filteredTasks);
  }

  /**
   * @method getTasksByCategory
   * @funcionalidad Se encarga de filtrar tareas por categoría
   * @param categoryId - El ID de la categoría
   * @returns Task[]
   */
  getTasksByCategory(categoryId: string): Task[] {
    return this.getTasks().filter(t => t.categoryId === categoryId);
  }
}
