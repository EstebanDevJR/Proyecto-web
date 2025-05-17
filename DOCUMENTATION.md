# Documentación del Proyecto Frontend Angular

## Arquitectura

Este proyecto sigue una arquitectura modular basada en Angular 18, utilizando conceptos modernos como lazy loading, módulos, servicios, componentes y guardias de ruta. A continuación se detalla la estructura y arquitectura del proyecto:

### Estructura del Sistema

El proyecto está compuesto por dos partes principales:

1. **Frontend Angular**
   - Aplicación cliente desarrollada con Angular 18
   - Interfaz de usuario y experiencia de usuario
   - Comunicación con el backend mediante API REST

2. **Backend Node.js**
   - Servidor API REST desarrollado con Express
   - Gestión de datos con Sequelize (PostgreSQL)
   - Autenticación mediante JWT
   - Validación y procesamiento de datos

### Estructura de Módulos

El frontend está organizado en los siguientes módulos principales:

1. **Módulo de Autenticación**
   - Gestiona el proceso de inicio de sesión, registro y recuperación de contraseña
   - Utiliza JWT para la autenticación de usuarios
   - Componentes: 
     - `SigninComponent`: Para inicio de sesión de usuarios existentes
     - `SignupComponent`: Para registro de nuevos usuarios
     - `Page404Component`: Para rutas no encontradas

2. **Módulo de Dashboard**
   - Presenta información resumida y gráficos relevantes
   - Implementa visualizaciones con NgxCharts, ApexCharts y ECharts
   - Componentes: Dashboard principal, widgets y tarjetas de información

3. **Módulo de Layout**
   - Define la estructura visual de la aplicación
   - Incluye componentes como Header, Sidebar, Footer
   - Gestiona la navegación y el responsive design

4. **Módulo de Páginas**
   - Contiene páginas adicionales como perfil de usuario, configuraciones, etc.
   - Implementa funcionalidades específicas de cada página

### Servicios Principales

El proyecto implementa diversos servicios para gestionar la lógica de negocio:

1. **AuthService**
   - Gestiona la autenticación y autorización de usuarios
   - Métodos principales:
     - `login(email, password)`: Autentica al usuario y obtiene un token JWT
     - `logout()`: Cierra la sesión del usuario eliminando tokens
     - `isAuthenticated()`: Verifica si el usuario está autenticado
     - `isAdminLogged()`: Verifica si el usuario tiene rol de administrador

2. **RegisterService**
   - Gestiona el registro público de nuevos usuarios
   - Método principal:
     - `registerUser(userData)`: Registra un nuevo usuario en el sistema

3. **UsersService**
   - Maneja operaciones CRUD para usuarios
   - Requiere autenticación para la mayoría de operaciones
   - Métodos principales:
     - `createUser(userData)`: Crea un nuevo usuario (requiere rol admin)
     - `updateUser(userId, userData)`: Actualiza un usuario existente
     - `deleteUser(userId)`: Elimina un usuario
     - `getAllUsers()`: Obtiene todos los usuarios

4. **DataService**
   - Realiza peticiones HTTP a la API
   - Implementa interceptores para manejar tokens y errores
   - Gestiona el caché y optimizaciones

### Guardias y Protección de Rutas

El proyecto implementa guardias para proteger las rutas:

- **AuthGuard**: Verifica que el usuario esté autenticado
- **RoleGuard**: Verifica los roles y permisos del usuario
- **UnsavedChangesGuard**: Previene la navegación si hay cambios sin guardar

### Componentes Compartidos

Los componentes compartidos incluyen:

- **Botones y controles personalizados**
- **Tablas y datatable con NgxDatatable**
- **Gráficos reutilizables**
- **Loaders y spinners**
- **Modales y diálogos**

### Gestión del Estado

El proyecto implementa gestión del estado a través de:

- **Servicios con estado**
- **RxJS para flujos de datos reactivos**
- **Patrón Observable/Subject para comunicación entre componentes**
- **SessionStorage para persistencia de tokens y datos de sesión**

### Internacionalización

El soporte multilenguaje se implementa con ngx-translate:

- Archivos JSON de traducciones para cada idioma
- Cambio dinámico de idioma
- Pipes para traducir textos

## Flujos Principales

### Registro de Usuario

1. El usuario accede a la ruta `/authentication/signup`
2. Completa el formulario con nombre, email y contraseña
3. El sistema valida los datos y los envía al backend
4. Si el registro es exitoso, se muestra confirmación y se redirige al login
5. Si hay errores, se muestran mensajes descriptivos

### Autenticación

1. El usuario accede a la ruta `/authentication/signin`
2. Ingresa credenciales (email y contraseña)
3. El sistema verifica las credenciales con el backend
4. Si son válidas, se obtiene un token JWT que se almacena en sessionStorage
5. El usuario es redirigido al dashboard

### Cierre de Sesión

1. El usuario hace clic en "Cerrar sesión"
2. El sistema elimina todos los tokens almacenados
3. Redirige al usuario a la página de inicio de sesión

### Navegación Protegida

1. El usuario intenta acceder a una ruta protegida
2. AuthGuard verifica si existe un token válido
3. Si no es válido, redirige a login
4. Si es válido, permite el acceso a la ruta

## Estructura del Backend

### Modelos

El backend define varios modelos de datos con Sequelize:

1. **User**: Almacena información de usuarios
   - id: Identificador único
   - nombre: Nombre completo
   - email: Correo electrónico único
   - password: Contraseña encriptada
   - rol_id: Referencia al rol del usuario
   - administrador_id: Referencia al administrador que lo gestiona

2. **Role**: Define roles del sistema
   - id: Identificador único
   - nombre: Nombre del rol (ADMIN, USER)

3. **RolePermission**: Relaciona roles con permisos
   - rol_id: Referencia al rol
   - permission_id: Referencia al permiso

### Endpoints de API

El backend expone los siguientes endpoints principales:

1. **Autenticación**
   - `POST /api/v1/auth/login`: Inicia sesión y obtiene token JWT
   - `POST /api/v1/auth/register`: Registra un nuevo usuario

2. **Usuarios**
   - `POST /api/v1/users/create`: Crea un nuevo usuario
   - `PUT /api/v1/users/update/:id`: Actualiza un usuario existente
   - `DELETE /api/v1/users/delete/:id`: Elimina un usuario
   - `GET /api/v1/users`: Obtiene todos los usuarios
   - `GET /api/v1/users/rol/:id`: Obtiene usuarios por rol

## Estilos y Temas

El proyecto utiliza un enfoque de estilos modular:

- **SCSS** como preprocesador
- **Variables SCSS** para temas y personalización
- **Angular Material** para componentes base
- **Bootstrap 5** para el sistema de grillas y utilidades
- **Personalización** de componentes Angular Material

## Optimizaciones

El proyecto implementa varias optimizaciones:

- **Lazy Loading** para cargar módulos bajo demanda
- **Tree Shaking** para reducir el tamaño del bundle
- **Minificación** de CSS y JavaScript
- **Caching** de peticiones HTTP frecuentes
- **PWA** para funcionamiento offline y carga rápida

## Convenciones de Código

El proyecto sigue las siguientes convenciones:

- **Formateo** con ESLint y Prettier
- **Naming** según guías oficiales de Angular
- **Tipado estricto** con TypeScript
- **Comentarios** explicativos en código complejo
- **Componentes** organizados por funcionalidad

## Proceso de Desarrollo

1. **Crear componente/servicio** siguiendo la estructura existente
2. **Implementar funcionalidad** respetando convenciones
3. **Probar** con casos de uso principales
4. **Documentar** cambios relevantes
5. **Integrar** mediante pull request 