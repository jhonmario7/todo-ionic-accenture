import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  // Guarda el estado actual de las tareas y notifica a los componentes cuando cambian
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  
  // Observable público para que los componentes se suscriban y reciban cambios automáticamente
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private readonly STORAGE_KEY = 'tasks'; 

  constructor(private storageService: StorageService) {
    this.loadTasks(); 
  }

  /* Carga las tareas desde el storage al iniciar */
  async loadTasks() {
    const tasks = await this.storageService.get(this.STORAGE_KEY);
    this.tasksSubject.next(tasks || []); 
  }

  /* Guarda las tareas actuales en el storage */
  private async saveTasks(tasks: Task[]) {
    await this.storageService.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks); 
  }

  /* Obtiene todas las tareas (snapshot actual, sin suscripción) */
  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  /* Agrega una nueva tarea */
  async addTask(title: string, categoryId: string) {
    const tasks = this.getTasks();
    const newTask: Task = {
      id: Date.now().toString(), // ID único basado en timestamp
      title: title.trim(),
      completed: false,
      categoryId: categoryId,
      createdAt: Date.now()
    };
    tasks.push(newTask); 
    await this.saveTasks(tasks); 
  }

  /* Actualiza una tarea existente */
  async updateTask(updatedTask: Task) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      await this.saveTasks(tasks);
    }
  }

  /* Marca una tarea como completada/pendiente (toggle) */
  async toggleComplete(taskId: string) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      await this.saveTasks(tasks);
    }
  }

  /* Elimina una tarea */
  async deleteTask(taskId: string) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await this.saveTasks(filteredTasks);
  }

  /* Filtra tareas por categoría */
  getTasksByCategory(categoryId: string): Task[] {
    return this.getTasks().filter(t => t.categoryId === categoryId);
  }
}
