# 🍳 FoodMagic Backend

Backend completo para la app FoodMagic con autenticación, persistencia de datos y OpenAI API.

## 🚀 Características

- **Autenticación JWT** - Registro, login y gestión de usuarios
- **Generación de recetas con IA** - OpenAI API integrada
- **Chat con el chef** - Asistente de cocina virtual
- **Persistencia de datos** - PostgreSQL + Prisma ORM
- **Gestión de favoritos** - Guarda tus recetas preferidas
- **Comunidad** - Compartir recetas públicas
- **Analytics** - Tracking de eventos para métricas
- **Type-safe** - TypeScript + Zod para validación

## 📦 Instalación

### Prerrequisitos

- Node.js (v18+)
- PostgreSQL (local o cloud)
- Cuenta en [OpenAI](https://platform.openai.com)

### Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Editar .env con tus credenciales
DATABASE_URL="postgresql://user:password@localhost:5432/foodmagic"
OPENAI_API_KEY="sk-..."
JWT_SECRET="your-secret-key"

# 4. Generar cliente de Prisma
npm run prisma:generate

# 5. Crear migraciones
npm run prisma:migrate

# 6. Correr el servidor en modo desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones
│   │   └── database.ts   # Prisma client
│   ├── controllers/      # Controladores de rutas
│   │   ├── authController.ts
│   │   └── recipeController.ts
│   ├── middleware/       # Middleware Express
│   │   └── auth.ts       # JWT authentication
│   ├── routes/           # Rutas API
│   │   ├── authRoutes.ts
│   │   └── recipeRoutes.ts
│   ├── services/         # Lógica de negocio
│   │   ├── authService.ts
│   │   ├── recipeService.ts
│   │   └── openaiService.ts
│   ├── utils/            # Utilidades
│   ├── validators/       # Validación con Zod
│   │   ├── authValidator.ts
│   │   └── recipeValidator.ts
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Schema de DB
└── package.json
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Recipes
- `POST /api/recipes/generate` - Generar recetas (requiere auth)
- `POST /api/recipes/chat` - Chat con el chef (requiere auth)
- `GET /api/recipes/favorites` - Obtener favoritos (requiere auth)
- `POST /api/recipes/:recipeId/favorite` - Toggle favorito (requiere auth)
- `GET /api/recipes/public` - Recetas públicas (opcional auth)
- `GET /api/recipes/:recipeId` - Detalle de receta (opcional auth)
- `POST /api/recipes/:recipeId/share` - Compartir receta (requiere auth)

### Health
- `GET /health` - Health check del servidor

## 🗄️ Base de Datos

### Modelos

- **User** - Usuarios registrados
- **Recipe** - Recetas generadas y compartidas
- **GeneratedRecipe** - Histórico de recetas generadas por usuario
- **FavoriteRecipe** - Recetas favoritas de usuarios
- **ChatMessage** - Historial del chat
- **SearchHistory** - Histórico de búsquedas
- **SharedRecipe** - Recetas compartidas
- **AnalyticsEvent** - Tracking de eventos

### Prisma Studio

```bash
npm run prisma:studio
```

Abre una interfaz visual para ver y editar la base de datos.

## 🔐 Seguridad

- **JWT** para autenticación
- **Bcrypt** para hash de passwords
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Validación Zod** en todas las entradas
- **Rate limiting** (puedes agregar con express-rate-limit)

## 📊 Analytics

El backend trackea automáticamente:
- Búsquedas de recetas
- Vistas de recetas
- Chat con el chef
- Compartir recetas
- Visualización de ads (puedes agregar desde el frontend)

## 🚀 Deployment

### Build para producción

```bash
npm run build
```

### Variables de entorno para producción

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
OPENAI_API_KEY=sk-...
JWT_SECRET=super-secret-key
CORS_ORIGIN=https://yourapp.com
```

### Sugerencias de hosting

- **Backend**: Railway, Render, Fly.io, Vercel (Node.js)
- **Database**: Supabase, Neon, Railway Postgres, AWS RDS

## 🧪 Testing

Puedes agregar tests con Jest:

```bash
npm install -D jest @types/jest ts-jest
```

## 📝 Notas

- El token JWT expira en 7 días por defecto
- Las recetas públicas se ordenan por likes
- El chat tiene límite de 150 palabras por respuesta
- Las imágenes de OpenAI Vision no están implementadas aún (futuro)

## 🔮 Roadmap

- [ ] Rate limiting
- [ ] Tests unitarios y de integración
- [ ] Docker container
- [ ] Cache con Redis
- [ ] WebSockets para chat en tiempo real
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth (Google, Apple)
- [ ] Modo premium (Stripe integration)

## 📄 Licencia

MIT

---

**Built with ❤️ by Alfisa 🦊**
