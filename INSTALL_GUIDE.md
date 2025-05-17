# Guía de Instalación y Configuración

Esta guía proporciona instrucciones detalladas para instalar, configurar y ejecutar el proyecto Angular con su backend Node.js.

## Requisitos del Sistema

### Software Necesario

- **Node.js**: Versión 18.x o superior
  - [Descargar Node.js](https://nodejs.org/)
  - Verificar instalación: `node -v`
  
- **npm**: Versión 10.x o superior (incluido con Node.js)
  - Verificar instalación: `npm -v`
  
- **Angular CLI**: Versión 18.x
  - Instalar globalmente: `npm install -g @angular/cli`
  - Verificar instalación: `ng version`

- **PostgreSQL**: Versión 12.x o superior
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)
  - Crear una base de datos llamada `proyecto_web`

- **Git**: Última versión estable
  - [Descargar Git](https://git-scm.com/downloads)
  - Verificar instalación: `git --version`

### Recursos de Hardware Recomendados

- **Procesador**: Core i5 o equivalente (2 núcleos mínimo)
- **Memoria RAM**: 8GB mínimo (16GB recomendado)
- **Espacio en Disco**: 1GB mínimo libre

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

### 2. Configurar la Base de Datos

1. Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE proyecto_web;
```

2. Anotar las credenciales de PostgreSQL (usuario, contraseña, host, puerto) para usarlas en la configuración.

### 3. Configurar el Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear un archivo `.env` en la carpeta backend con la siguiente configuración:
```
PORT=3000
JWT_SECRET=Proyecto-web-secret-key-2023
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=proyecto_web
DB_PORT=5432
```

3. Instalar las dependencias del backend:
```bash
npm install
```

4. Inicializar la base de datos con los roles necesarios:
```bash
node src/createRoles.js
```

5. Crear el usuario administrador predeterminado:
```bash
node src/createAdminUser.js
```
   Esto creará un usuario con las siguientes credenciales:
   - Email: admin@example.com
   - Contraseña: admin123
   - Rol: Administrador

### 4. Configurar el Frontend

1. Volver al directorio principal:
```bash
cd ..
```

2. Instalar las dependencias del frontend:
```bash
npm install
```

3. Configurar Variables de Entorno

El proyecto utiliza diferentes configuraciones según el entorno. Los archivos de configuración se encuentran en:

```
src/environments/environment.ts          # Desarrollo
src/environments/environment.prod.ts     # Producción
```

Asegúrate de que `urlServicios` apunte a la dirección correcta del backend:
```javascript
export const environment = {
  production: false,
  appVersion: 'v1.0.0',
  urlServicios: 'http://localhost:3000', // URL del backend
  logoutTimeout: 900000,
  environment: 'local',
};
```

## Iniciar la Aplicación

### 1. Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:3000/`

### 2. Iniciar el Frontend

En otra terminal:
```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

### 3. Acceder a la Aplicación

1. Abre tu navegador y visita `http://localhost:4200/`
2. Inicia sesión con las credenciales de administrador:
   - Email: admin@example.com
   - Contraseña: admin123

O regístrate como nuevo usuario desde la opción "Regístrate".

## Configuración Adicional

### Proxy para Desarrollo

Si necesita configurar un proxy para el desarrollo (para evitar problemas CORS), puede crear un archivo `proxy.conf.json` en la raíz del proyecto:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Y luego modificar el comando de inicio en `package.json`:

```json
"start": "ng serve --proxy-config proxy.conf.json"
```

### Configuración de PWA

El proyecto puede configurarse como Progressive Web App (PWA). Para habilitarlo:

```bash
ng add @angular/pwa
```

### Configuración de Internacionalización

Los archivos de traducción se encuentran en:

```
src/assets/i18n/*.json
```

Para añadir un nuevo idioma:

1. Crear un nuevo archivo JSON en la carpeta i18n
2. Copiar la estructura del archivo existente
3. Traducir los valores
4. Configurar el nuevo idioma en el servicio de traducción

## Construcción para Producción

### Generar Build de Producción

Para el frontend:
```bash
npm run build
```

El resultado se guardará en el directorio `dist/`.

Para el backend:
```bash
cd backend
npm install --production
```

### Despliegue

Para desplegar en un servidor de producción:

1. Configure las variables de entorno para producción
2. Compile el frontend para producción
3. Configure el servidor web (nginx, Apache) para servir el frontend
4. Configure el backend como un servicio (pm2, systemd)
5. Configure un proxy inverso para redirigir /api al backend

## Solución de Problemas Comunes

### Error: Cannot find module '@angular/core'

Solución:
```bash
npm clean-install
```

### Error de conexión con la base de datos

Solución:
- Verificar que PostgreSQL esté en ejecución
- Verificar las credenciales en el archivo .env
- Verificar que la base de datos exista

### Error al iniciar el servidor de desarrollo

Solución:
```bash
ng cache clean
npm start
```

### Error de JWT en el backend

Solución:
- Verificar que JWT_SECRET esté definido en .env
- Verificar que el token no esté caducado
- Limpiar el localStorage/sessionStorage del navegador

## Recursos Adicionales

- [Documentación oficial de Angular](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [RxJS](https://rxjs.dev/guide/overview)
- [TypeScript](https://www.typescriptlang.org/docs/) 