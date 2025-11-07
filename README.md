# 🍽️ Sistema POS Restaurante - Backend

Backend API REST para sistema de punto de venta de restaurante usando Node.js, Express, Prisma y PostgreSQL.

## 📋 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

## 🚀 Configuración Inicial

### 1. Crear cuenta en Supabase (Gratis)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Ve a **Settings** > **Database**
5. Copia la **Connection String** (URI mode)

Ejemplo de URL:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Database URL de Supabase
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Secret (genera una clave segura)
JWT_SECRET="tu-clave-super-secreta-cambiala-por-algo-aleatorio"

# Puerto del servidor
PORT=5000

# URL del frontend
FRONTEND_URL="http://localhost:5173"
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Crear las Tablas en la Base de Datos

```bash
npm run migrate
```

Este comando creará todas las tablas en tu base de datos de Supabase.

### 5. (Opcional) Ver la Base de Datos

```bash
npm run studio
```

Esto abrirá Prisma Studio en tu navegador para ver y editar los datos.

## 🎯 Ejecutar el Servidor

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor estará corriendo en: `http://localhost:5000`

## 📚 Endpoints de la API

### Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@pos.com",
  "username": "admin",
  "password": "admin123",
  "fullName": "Administrador",
  "role": "ADMIN"
}
```

Roles disponibles: `ADMIN`, `MANAGER`, `CASHIER`, `WAITER`

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@pos.com",
    "username": "admin",
    "fullName": "Administrador",
    "role": "ADMIN"
  }
}
```

#### Ver Perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Categorías

#### Listar Categorías
```http
GET /api/categories
Authorization: Bearer {token}
```

#### Crear Categoría
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bebidas",
  "description": "Bebidas frías y calientes",
  "color": "#3B82F6",
  "icon": "🥤"
}
```

### Productos

#### Listar Productos
```http
GET /api/products
Authorization: Bearer {token}
```

Filtros opcionales:
- `?categoryId=uuid` - Filtrar por categoría
- `?isActive=true` - Filtrar por activos/inactivos

#### Crear Producto
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Café Americano",
  "description": "Café negro clásico",
  "price": 3.50,
  "cost": 1.20,
  "stock": 100,
  "minStock": 10,
  "categoryId": "uuid-de-categoria"
}
```

#### Actualizar Producto
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 4.00,
  "stock": 80
}
```

### Órdenes/Ventas

#### Listar Órdenes
```http
GET /api/orders
Authorization: Bearer {token}
```

Filtros opcionales:
- `?status=COMPLETED` - Filtrar por estado
- `?startDate=2025-11-01` - Fecha inicio
- `?endDate=2025-11-30` - Fecha fin

#### Crear Orden
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid-producto-1",
      "quantity": 2
    },
    {
      "productId": "uuid-producto-2",
      "quantity": 1
    }
  ],
  "paymentMethod": "CASH",
  "tableNumber": "5",
  "customerName": "Juan Pérez",
  "notes": "Sin azúcar",
  "tax": 0.50,
  "discount": 0
}
```

Métodos de pago: `CASH`, `CARD`, `TRANSFER`, `MIXED`

## 🗄️ Modelos de Base de Datos

### User (Usuario)
- `id` - UUID
- `email` - Email único
- `username` - Nombre de usuario único
- `password` - Contraseña hasheada
- `fullName` - Nombre completo
- `role` - Rol (ADMIN, MANAGER, CASHIER, WAITER)
- `isActive` - Usuario activo

### Category (Categoría)
- `id` - UUID
- `name` - Nombre único
- `description` - Descripción opcional
- `color` - Color para UI
- `icon` - Icono emoji

### Product (Producto)
- `id` - UUID
- `name` - Nombre del producto
- `description` - Descripción
- `price` - Precio de venta
- `cost` - Costo (para calcular ganancias)
- `stock` - Cantidad en inventario
- `minStock` - Stock mínimo para alertas
- `categoryId` - Categoría del producto

### Order (Orden/Venta)
- `id` - UUID
- `orderNumber` - Número de orden (ORD-000001)
- `status` - Estado (PENDING, COMPLETED, CANCELLED)
- `subtotal` - Subtotal
- `tax` - Impuesto
- `discount` - Descuento
- `total` - Total
- `paymentMethod` - Método de pago
- `userId` - Usuario que realizó la venta

### OrderItem (Item de Orden)
- `id` - UUID
- `orderId` - ID de la orden
- `productId` - ID del producto
- `quantity` - Cantidad
- `price` - Precio al momento de la venta
- `subtotal` - Subtotal del item

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación con JWT
- ✅ Tokens con expiración de 24h
- ✅ Middleware de autenticación
- ✅ Control de roles
- ✅ CORS configurado

## 📦 Deploy en Render

1. Crea cuenta en [render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo **Web Service**
4. Configuración:
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`
5. Agrega las variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

## 🧪 Crear Usuario de Prueba

Después de iniciar el servidor, puedes crear un usuario admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos.com",
    "username": "admin",
    "password": "admin123",
    "fullName": "Administrador Principal",
    "role": "ADMIN"
  }'
```

## 📖 Scripts Disponibles

- `npm start` - Inicia el servidor
- `npm run dev` - Modo desarrollo con auto-reload
- `npm run migrate` - Crea/actualiza tablas en BD
- `npm run studio` - Abre Prisma Studio
- `npm run generate` - Genera Prisma Client

## 🆘 Solución de Problemas

### Error: "Environment variable not found: DATABASE_URL"
- Asegúrate de tener el archivo `.env` configurado
- Verifica que la URL de Supabase sea correcta

### Error: "Can't reach database server"
- Verifica tu conexión a internet
- Confirma que la URL de Supabase sea correcta
- Verifica que el password esté sin corchetes

### Error al hacer migrate
- Asegúrate de que la base de datos esté accesible
- Verifica que tengas permisos en Supabase

## 📞 Soporte

Si tienes problemas, revisa:
- La URL de conexión de Supabase
- Que todas las dependencias estén instaladas
- Los logs del servidor con `npm run dev`

---

¡Hecho con ❤️ para tu restaurante! 🍕
