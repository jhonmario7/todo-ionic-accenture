# Respuestas Técnicas - Prueba Accenture

## 1. Principales Desafíos Técnicos

### Integración de Firebase Remote Config
El mayor reto fue configurar correctamente el SDK modular de Firebase en un proyecto Ionic/Cordova. Específicamente:
- Manejar la inicialización asíncrona de Remote Config antes de que los componentes la consuman
- Configurar `minimumFetchIntervalMillis` para desarrollo vs producción
- Gestionar valores por defecto cuando Firebase no está disponible (offline)

**Solución implementada**: Servicio dedicado con método `waitForInitialization()` que garantiza que Remote Config esté listo antes de retornar valores.

### Persistencia Reactiva con Ionic Storage
Sincronizar el estado en memoria (BehaviorSubjects) con el almacenamiento persistente requirió:
- Asegurar que cada operación CRUD primero actualice memoria y luego persista
- Mantener un único flujo de datos (single source of truth) mediante Observables
- Evitar race conditions al cargar datos iniciales

**Solución implementada**: Patrón Repository donde el servicio es responsable de sincronizar `BehaviorSubject.next()` con `Storage.set()`.

### Feature Flag sin romper UX
Ocultar el módulo de categorías dinámicamente sin generar errores en componentes que dependen de `selectedCategoryId`:
- Si el flag está en `false`, el selector de categoría desaparece pero la lógica interna necesita un valor por defecto
- Evitar que el filtro de categorías crashee cuando se cambia el flag en tiempo real

**Solución implementada**: Valor por defecto 'personal' hardcodeado + directivas `*ngIf` en elementos dependientes del flag.

---

## 2. Técnicas de Optimización Aplicadas

### TrackBy Functions en Listas
```typescript
trackByTaskId(index: number, task: Task): string {
  return task.id;
}
```

Impacto: Reduce re-renderizado. Angular solo actualiza items modificados en lugar de re-crear toda la lista.

### Cálculo de Filtros en Componente

```typescript
getFilteredTasks(): Task[] {
  if (this.filterCategoryId === 'all') return this.tasks;
  return this.tasks.filter(t => t.categoryId === this.filterCategoryId);
}
```
Impacto: Evita recálculo en cada ciclo de detección de cambios. El template llama al método una vez por renderizado.

### Lazy Loading de Módulos

```typescript
{
  path: 'categories',
  loadChildren: () => import('./pages/categories/categories.module')
    .then(m => m.CategoriesPageModule)
}
```

Impacto: La página de categorías solo se descarga cuando el usuario navega a ella, reduciendo el bundle inicial.

## Standalone Components

### Migración a arquitectura standalone de Angular 17:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
```

Impacto: Mejor tree-shaking, bundles más pequeños, menos archivos .module.ts.

## 3. Aseguramiento de Calidad y Mantenibilidad

### Separación de Responsabilidades

 - Servicios: Lógica de negocio (TasksService, CategoriesService, StorageService)
 - Componentes: Solo UI y manejo de eventos
 - Modelos: Interfaces TypeScript para contratos de datos

Esta arquitectura facilita testing unitario y reutilización.

### Tipado Estricto con TypeScript

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
}
```
Todas las entidades tienen interfaces definidas, evitando errores en tiempo de ejecución.

### Componentes Reutilizables

El modal CategoryFormComponent es standalone y reutilizable:

 - Recibe datos mediante @Input()
 - Comunica resultados mediante ModalController.dismiss()
 - Funciona tanto para crear como editar (modo determinado por prop isEdit)

### Comentarios Descriptivos

Cada método público tiene comentario JSDoc explicando su propósito:

```typescript
  /**
   * @method addTask
   * @funcionalidad Se encarga de agregar una nueva tarea
   * @returns Promise<void>
   */
```

### Commits Semánticos

Uso de conventional commits:

 - feat: para nuevas funcionalidades
 - fix: para correcciones
 - docs: para documentación
 - chore: para configuración

Esto facilita:

 - Generación automática de changelogs
 - Identificación rápida de cambios importantes
 - Integración con herramientas de CI/CD

 ### Tecnologías Dominadas en este Proyecto

 - Ionic Framework 7: Componentes UI nativos multiplataforma
 - Angular 17: Framework frontend con arquitectura standalone
 - TypeScript: Tipado estático y programación orientada a objetos
 - RxJS: Programación reactiva con Observables
 - Firebase Remote Config: Feature flags remotos
 - Ionic Storage: Persistencia local con IndexedDB
 - Cordova: Wrapper nativo para Android/iOS
 - Git: Control de versiones con flujo profesional


```bash
Jhon Mario Rodriguez Ramirez
Prueba Técnica - Accenture Latinoamérica
Enero 2026
```