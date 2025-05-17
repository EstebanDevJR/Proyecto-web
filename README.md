# Frontend Angular Project

Este proyecto es una aplicación Angular desarrollada con TypeScript que utiliza Angular Material y diversos componentes avanzados para crear una aplicación web moderna. Incluye un backend Node.js con Express y PostgreSQL para gestionar la autenticación y almacenamiento de datos.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 10 o superior)
- PostgreSQL (versión 12 o superior)

## Instalación

1. Clonar el repositorio
2. Instalar las dependencias del frontend:
```bash
npm install
```
3. Instalar las dependencias del backend:
```bash
cd backend
npm install
```

## Ejecución

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. En otra terminal, iniciar el frontend:
```bash
npm start
```

El frontend estará disponible en `http://localhost:4200/`
El backend estará disponible en `http://localhost:3000/`

## Estructura del Proyecto

```
├── backend/             # Servidor Node.js con Express
│   ├── src/
│   │   ├── config/      # Configuración de DB y JWT
│   │   ├── controllers/ # Controladores de la API
│   │   ├── middlewares/ # Middlewares (auth, error handling)
│   │   ├── models/      # Modelos de Sequelize
│   │   ├── routes/      # Rutas de la API
│   │   ├── services/    # Lógica de negocio
│   │   └── utils/       # Utilidades
│   └── package.json     # Dependencias del backend
├── src/
│   ├── app/
│   │   ├── authentication/  # Módulo de autenticación y registro
│   │   ├── config/          # Configuraciones globales
│   │   ├── core/            # Servicios y componentes centrales
│   │   ├── dashboard/       # Módulo del dashboard principal
│   │   ├── layout/          # Componentes de la estructura visual
│   │   ├── pages/           # Páginas adicionales
│   │   ├── services/        # Servicios de la aplicación
│   │   └── shared/          # Componentes compartidos
│   ├── assets/              # Recursos estáticos
│   └── environments/        # Configuraciones por entorno
└── package.json         # Dependencias del frontend
```

## Características

- Sistema completo de autenticación y registro
  - Inicio de sesión con JWT
  - Registro de nuevos usuarios
  - Gestión de roles y permisos
- Diseño responsivo con Bootstrap 5
- Componentes Angular Material
- Gráficos con NgxCharts, ApexCharts y ECharts
- Calendario completo (FullCalendar)
- Editor de texto enriquecido
- Exportación de datos a Excel
- Soporte para mapas de Google
- Visualizador de PDF integrado
- Soporte multilenguaje con ngx-translate

## Scripts Disponibles

### Frontend
- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Genera la versión de producción
- `npm test`: Ejecuta las pruebas unitarias
- `npm run lint`: Verifica el estilo de código

### Backend
- `npm run dev`: Inicia el servidor de desarrollo con Nodemon
- `node src/createRoles.js`: Crea los roles necesarios en la base de datos
- `node src/createAdminUser.js`: Crea un usuario administrador por defecto

## Dependencias Principales

### Frontend
- Angular 18
- Angular Material
- Bootstrap 5
- RxJS
- SweetAlert2
- JWT Decode

### Backend
- Express
- Sequelize (PostgreSQL)
- JWT
- Bcrypt
- CORS

## Contribución

1. Crear una rama para la nueva funcionalidad
2. Desarrollar y probar la nueva funcionalidad
3. Asegurarse de que el código pase las pruebas de linting
4. Crear una Pull Request con una descripción detallada del cambio


