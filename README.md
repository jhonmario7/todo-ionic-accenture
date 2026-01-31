# TO-DO Ionic App - Prueba Técnica Accenture

Aplicación móvil híbrida de gestión de tareas desarrollada con Ionic Framework, Angular y Cordova. Incluye integración con Firebase Remote Config para control de funcionalidades mediante feature flags.

## Características Principales

- CRUD completo de tareas (crear, completar, editar y eliminar)
- Gestión de categorías personalizadas con colores
- Filtrado de tareas por categoría
- Persistencia local con Ionic Storage (IndexedDB)
- Modo claro/oscuro
- Feature flag remoto para habilitar/deshabilitar módulo de categorías
- Multiplataforma (Android e iOS)

## Tecnologías Utilizadas

- Framework: Ionic 7 + Angular 17
- Runtime nativo: Cordova
- Backend: Firebase Remote Config
- Persistencia: Ionic Storage
- Lenguaje: TypeScript
- Control de versiones: Git + GitHub

## Requisitos Previos

- Node.js v20.19.0 o superior
- npm v9.6.7 o superior
- Ionic CLI v7.2.1 o superior
- Git

Para compilar Android se necesita:
- Java JDK 11 o superior
- Android SDK (API Level 33+)
- Gradle 7.x

Para compilar iOS se requiere:
- macOS con Xcode 14+
- CocoaPods

## Instalación y Configuración

### Clonar el repositorio

```bash
git clone https://github.com/jhonmario7/todo-ionic-accenture.git
cd todo-ionic-accenture
```
### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
ionic serve
```

La aplicación estará disponible en http://localhost:8100

## Compilación para Dispositivos

### Android

```bash
ionic cordova platform add android
ionic cordova build android --release
```

El APK se genera en platforms/android/app/build/outputs/apk/

### iOS

```bash
ionic cordova platform add ios
ionic cordova build ios
```
Nota: La compilación iOS requiere macOS con Xcode. Como alternativa se puede usar Ionic Appflow para builds en la nube.

## Firebase Remote Config

La aplicación utiliza Firebase Remote Config con el parámetro enableCategories para controlar la visibilidad del módulo de categorías.

### Valores:

```bash
"true": Muestra el módulo de categorías completo

"false": Oculta categorías y asigna tareas a categoría por defecto
```

### Para modificar el valor:

Acceder a Firebase Console:

 - Seleccionar proyecto todo-ionic-accenture
 - Ir a Remote Config
 - Cambiar valor de enableCategories
 - Publicar cambios
 - Recargar la aplicación

## Estructura del Proyecto

```bash
src/app/
├── core/
│   ├── models/              # Modelos de datos (Task, Category)
│   └── services/            # Servicios (Storage, Tasks, Categories, Theme, RemoteConfig)
├── home/                    # Página principal con lista de tareas
├── pages/
│   └── categories/          # Gestión de categorías
└── modals/
    └── category-form/       # Formulario para agregar/editar categorías
```    

## Decisiones Técnicas

### Arquitectura

Se implementó una arquitectura basada en servicios para separar la lógica de negocio de la presentación. Los componentes son standalone siguiendo las recomendaciones actuales de Angular.

### Gestión de Estado

Se utilizan BehaviorSubjects con Observables para mantener sincronizado el estado de la aplicación. Esto permite que los componentes reaccionen automáticamente a cambios en tareas y categorías.

### Persistencia

Ionic Storage con IndexedDB permite mantener los datos localmente sin necesidad de backend. Los datos persisten entre sesiones de la aplicación.

### Feature Flags

Firebase Remote Config permite controlar funcionalidades sin redesplegar la aplicación. Actualmente se usa para el módulo de categorías, pero la arquitectura permite agregar más flags fácilmente.

## Optimizaciones Implementadas

- TrackBy en listas para mejorar rendimiento del renderizado
- Lazy loading de módulos para reducir tiempo de carga inicial
- Cálculo de filtros en el componente en lugar del template
- Standalone components para mejor tree-shaking

```bash
Autor
Jhon Mario
Prueba Técnica - Accenture Latinoamérica
``` 