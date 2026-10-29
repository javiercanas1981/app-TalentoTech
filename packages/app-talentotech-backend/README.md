# Backend

API de productos y autenticación con NestJS, Firestore y Firebase Authentication.

## Configuración

En PowerShell, copia `.env.example` a `.env` con `Copy-Item .env.example .env` y reemplaza los valores de ejemplo por la configuración de una aplicación web en Firebase Console > Project settings > General. `API_KEY`, `PROJECT_ID` y `APP_ID` son obligatorios; también se aceptan sus alias `FIREBASE_*`. `.env` no se versiona. Habilita Email/Password en Firebase Console > Authentication > Sign-in method.

Ejecuta `npm install` y luego `npm run dev` desde esta carpeta. El servidor escucha en el puerto `3000` por defecto; `PORT` permite cambiarlo.

## API de productos

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/session` (requiere `Authorization: Bearer <Firebase ID token>`)

El cuerpo para crear y actualizar acepta `name`, `category`, `price`, `unit`, `image` y `description`; `weight`, `rating`, `reviewsCount`, `cookingTip`, `tags` e `isFeatured` son opcionales.
`stock` es opcional y debe ser un entero mayor o igual a cero; si no se envía, se inicializa en `0`.

El registro acepta `{ "name": "...", "email": "...", "password": "..." }`, crea la cuenta en Firebase Authentication y guarda un documento en `users/{uid}` con `name`, `email`, `role: "user"` y `createdAt`. El rol se asigna siempre en el backend. Para otorgar acceso administrativo, cambia manualmente el campo `role` del documento correspondiente a `admin` desde Firebase Console; por compatibilidad, la autorización también reconoce el campo existente `rol`. Nunca aceptes un rol desde el formulario ni desde una petición pública.

El inicio de sesión acepta `{ "email": "...", "password": "..." }`; ambos endpoints devuelven un ID token de Firebase y el rol consultado en Firestore. El panel del frontend requiere `role: "admin"`. El backend verifica el ID token y consulta nuevamente el rol en Firestore en cada operación de crear, editar o eliminar productos, respondiendo `403 Forbidden` a usuarios sin rol de administrador. Los endpoints de lectura y pedidos siguen siendo públicos.

El pedido se confirma enviando `items` con `productId` y `quantity`, más una `idempotencyKey` única. El backend lee los precios y el stock actuales, descuenta inventario y registra la orden en una transacción Firestore. Si no hay stock, responde `409 Conflict` sin modificar ningún producto ni crear la orden. Reintentar con la misma clave devuelve la orden existente sin volver a descontar stock. Este flujo registra el pedido, pero no procesa pagos.

La documentación interactiva de Swagger está disponible en `/api/docs`.

El frontend consume estos endpoints desde `/api`. Al ejecutar Vite en desarrollo, las peticiones se redirigen al backend en `http://localhost:3000`; configura `BACKEND_URL` si el servidor usa otra dirección. Para otros entornos, `VITE_API_URL` permite configurar la URL base de la API (por ejemplo, `https://api.example.com/api`).
