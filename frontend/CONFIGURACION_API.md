# Configuración de API para diferentes ambientes

Para el proyecto usamos variables de entorno de Vite para configurar la URL de la API según el ambiente de ejecución, así evitamos que queden hardcodeadas.

## Archivos de configuración

### Variables de Entorno

- **`.env.development`** - Usado cuando ejecutamos `npm run dev`
- **`.env.production`** - Usado cuando ejecutamos `npm run build`
- **`.env.test`** - Usado para pruebas

### Archivo de Configuración Centralizado

- **`src/config/api.js`** - Exporta la configuración de la API y todos los endpoints

## Cómo Funciona

1. **Variables de Entorno**: Vite expone automáticamente las variables que comienzan con `VITE_` en `import.meta.env`

2. **Configuración Centralizada**: El archivo `src/config/api.js` lee la variable `VITE_API_BASE_URL` y construye todos los endpoints

3. **Servicios**: Todos los servicios importan la configuración desde `src/config/api.js`

## Uso en Diferentes Ambientes

### Local
```bash
# Usa .env.development automáticamente
npm run dev
```

La aplicación se conecta a `http://localhost:8080`

### Producción
```bash
# Usa .env.production automáticamente
npm run build
npm run preview
```

La aplicación se conecta a la URL configurada en `.env.production` ( `https://api.mercadoexclusivo.com`)

### Testing
```bash
# Usa .env.test
npm run test
```

**Nota**: `.env.local` tiene prioridad sobre los demás archivos de entorno. Si es necesario para pruebas se puede crear ese archivo y ya está agregado en gitignore para que no afecte a los demás.

## Ejemplo de Uso en Código

### En servicios:
```javascript
import { API_CONFIG } from "../config/api.js";

const API_URL = API_CONFIG.ENDPOINTS.PRODUCTOS;
// Resultado: http://localhost:8080/api/productos
```

### En componentes:
```javascript
import { API_CONFIG } from "../config/api.js";

const response = await fetch(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`);
// Resultado: http://localhost:8080/api/usuarios/123
```

## Endpoints Disponibles

El objeto `API_CONFIG.ENDPOINTS` incluye:

- `AUTH`: `/api/auth`
- `USUARIOS`: `/api/usuarios`
- `PRODUCTOS`: `/api/productos`
- `CATEGORIAS`: `/api/categorias`
- `CARRITO`: `/api/carrito`
- `PEDIDOS`: `/api/pedidos`
- `ADMIN`: `/api/admin`

### Cambios en .env

Vite requiere reiniciar el servidor de desarrollo cuando cambiamos archivos `.env`:

```bash
# Detener el servidor (Ctrl+C) y volver a ejecutar:
npm run dev