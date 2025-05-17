// Interfaz que define la estructura de configuración de la aplicación
export interface InConfiguration {
  // Sección de configuración del layout/maquetación
  layout: {
    rtl: boolean;          // Define si el diseño es right-to-left (para idiomas como árabe/hebreo)
    variant: string;       // Variante del tema (ej: 'light', 'dark')
    theme_color: string;   // Color principal del tema (ej: 'blue', 'green')
    logo_bg_color: string; // Color de fondo del logo
    
    // Configuración específica de la barra lateral
    sidebar: {
      collapsed: boolean;      // Si la barra está colapsada/expandida
      backgroundColor: string; // Color de fondo de la barra
    };
  };
}