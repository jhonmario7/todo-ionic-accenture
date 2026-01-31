import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode: boolean = false;

  constructor() {
    /* Cargar preferencia guardada o detectar preferencia del sistema */
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('darkMode');

    /* Establecer estado inicial del tema */
    this.darkMode = savedTheme ? savedTheme === 'true' : prefersDark.matches;
    this.applyTheme();
  }

  /**
   * @method toggleDarkMode
   * @funcionalidad Se encarga de alternar entre claro/oscuro
   */
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  /**
   * @method applyTheme
   * @funcionalidad Se encarga de aplicar el tema al html
   */
  private applyTheme() {
    const prefersDark = this.darkMode;
    document.body.classList.toggle('ion-palette-dark', prefersDark);

    // Aplico el tema al html para compatibilidad total
    if (prefersDark) {
      document.body.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('ion-palette-dark');
    }
  }

  /**
   * @method isDarkMode
   * @funcionalidad Se encarga de obtener el estado actual
   * @returns boolean
   */
  isDarkMode(): boolean {
    return this.darkMode;
  }
}
