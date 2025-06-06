// Importamos los decoradores y tipos necesarios de Angular
import { Injectable } from '@angular/core';
// Importamos la interfaz que define la estructura de configuración
import { InConfiguration } from '../core/models/config.interface';

// Decorador que marca esta clase como un servicio inyectable
@Injectable({
  providedIn: 'root', // Lo proveemos en el nivel raíz para que esté disponible en toda la app
})
export class ConfigService {
  // Variable pública que almacenará toda la configuración de la app
  // El signo ! indica que será inicializada más tarde (non-null assertion)
  public configData!: InConfiguration;

  // Constructor del servicio - se ejecuta al crear una instancia
  constructor() {
    // Inicializamos la configuración apenas se crea el servicio
    this.setConfigData();
  }

  // Este método parece estar inspirado en el ciclo de vida de los componentes
  // (aunque en servicios no es común tener ngOnInit)
  ngOnInit() {
    // Cargamos la configuración almacenada
    this.loadConfigData();
  }

  /**
   * Método para establecer los valores por defecto de configuración
   * Define la estructura base con valores iniciales para:
   * - Dirección del texto (RTL)
   * - Variante de color (claro/oscuro)
   * - Colores del tema y logo
   * - Configuración de la barra lateral
   */
  setConfigData() {
    this.configData = {
      layout: {
        rtl: false, // ¿Interfaz de derecha a izquierda? (para idiomas como árabe)
        variant: 'light', // Tema claro u oscuro
        theme_color: 'cyan', // Color principal del tema
        logo_bg_color: 'white', // Color de fondo del logo
        sidebar: {
          collapsed: false, // Barra lateral expandida o colapsada por defecto
          backgroundColor: 'light', // Color de fondo de la barra lateral
        },
      },
    };
    // Guardamos la configuración en el localStorage para persistencia
    localStorage.setItem('configData', JSON.stringify(this.configData));
  }

  /**
   * Carga la configuración desde el localStorage
   * Si no existe configuración guardada, establece los valores por defecto
   */
  loadConfigData() {
    // Obtenemos la configuración almacenada
    const configData = localStorage.getItem('configData');
    
    if (configData) {
      // Si existe configuración guardada, la parseamos y asignamos
      this.configData = JSON.parse(configData);
    } else {
      // Si no existe, establecemos los valores por defecto
      this.setConfigData();
    }
  }
}