# 🍳 FoodMagic - Full Stack Documentation

FoodMagic es una app completa de React Native (frontend) + Node.js (backend) que genera recetas personalizadas usando IA.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                          │
│  (Home, Recipes, RecipeDetail, Chat)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Node.js Backend                            │
│  ┌─────────────┬──────────────┬─────────────────────────┐  │
│  │ Auth (JWT)  │ OpenAI API   │ PostgreSQL (Prisma)     │  │
│  └─────────────┴──────────────┴─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Frontend (React Native + Expo)

**Ubicación:** `/foodmagic/`

### Tecnologías
- React Native + Expo
- TypeScript
- Zustand (estado global)
- React Navigation
- AdMob (monetización)

### Pantallas
1. **HomeScreen** - Input de ingredientes, selector de modo
2. **RecipesScreen** - Lista de resultados
3. **RecipeDetailScreen** - Detalle con instrucciones
4. **ChatScreen** - Chat con el chef virtual

### Para correr el frontend
```bash
cd foodmagic
npm install
echo "EXPO_PUBLIC_OPENAI_API_KEY=tu_key" > .env
npm start
```

## 🖥️ Backend (Node.js + Express + TypeScript)

**Ubicación:** `/foodmagic/backend/`

### Tecnologías
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT (autenticación)
- Zod (validación)

### API Endpoints

#### Auth
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (auth)
```

#### Recipes
```
POST /api/recipes/generate (auth)
POST /api/recipes/chat (auth)
GET /api/recipes/favorites (auth)
POST /api/recipes/:recipeId/favorite (auth)
GET /api/recipes/public
GET /api/recipes/:recipeId
POST /api/recipes/:recipeId/share (auth)
```

### Para correr el backend
```bash
cd foodmagic/backend
npm install
cp .env.example .env
# Editar .env con DATABASE_URL y OPENAI_API_KEY
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 🗄️ Base de Datos

### Tablas
- **users** - Usuarios registrados
- **recipes** - Recetas generadas y públicas
- **generated_recipes** - Histórico por usuario
- **favorite_recipes** - Favoritos de usuarios
- **chat_messages** - Mensajes del chat
- **search_history** - Histórico de búsquedas
- **shared_recipes** - Recetas compartidas
- **analytics_events** - Tracking de eventos

## 🔐 Flujo de Autenticación

```
1. Usuario se registra → /api/auth/register
   → Recibe token JWT

2. Usuario hace login → /api/auth/login
   → Recibe token JWT

3. Usuario hace requests con token
   → Header: Authorization: Bearer <token>
   → Backend valida token con middleware
```

## 💡 Flujo de Uso

### Generar recetas
```
Frontend → POST /api/recipes/generate
           { ingredients: [...], mode: "normal" }
           ↓
Backend → Genera recetas con OpenAI API
           ↓
Backend → Guarda en DB (recipe, generated_recipe, search_history)
           ↓
Backend → Retorna recetas
           ↓
Frontend → Muestra lista + ad interstitial
```

### Chat con el chef
```
Frontend → POST /api/recipes/chat
           { message: "...", history: [...] }
           ↓
Backend → Llama OpenAI API
           ↓
Backend → Guarda en DB (chat_message)
           ↓
Backend → Retorna respuesta
           ↓
Frontend → Muestra en chat + banner ad
```

### Gestión de favoritos
```
Frontend → POST /api/recipes/:recipeId/favorite
           ↓
Backend → Busca si ya es favorito
           ↓
Backend → Si existe: borra / Si no: crea
           ↓
Backend → Si se creó: incrementa likes de receta
           ↓
Backend → Retorna { isFavorite: true/false }
```

## 🚀 Deployment

### Backend
Opciones recomendadas:
- **Railway** - Postgres + Node.js en un solo lugar
- **Render** - Free tier disponible
- **Fly.io** - Global edge deployment
- **Vercel/Netlify** - Si migras a serverless

### Frontend
Opciones:
- **EAS Build** - Para iOS y Android stores
- **Expo Application Services** - Hosting de updates OTA

### Database
- **Supabase** - Postgres con auth gratis
- **Neon** - Postgres serverless
- **Railway** - Postgres integrado

## 🔗 Integración Frontend-Backend

### Configurar URL del backend en el frontend

En `foodmagic/src/services/recipeService.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
```

Crear `.env` en el frontend:
```env
EXPO_PUBLIC_API_URL=https://tu-backend.com/api
EXPO_PUBLIC_OPENAI_API_KEY=tu_api_key
```

### Ejemplo de llamada API desde el frontend

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const generateRecipes = async (ingredients: string[], mode: string) => {
  const token = await getToken(); // Obtenido del storage del usuario

  const response = await axios.post(
    `${API_BASE_URL}/recipes/generate`,
    { ingredients, mode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
```

## 📊 Analytics Tracking

El backend trackea automáticamente:
- `search` - Cuando se generan recetas
- `chat` - Mensajes del chat
- `view_recipe` - Vista de receta
- `share` - Compartir receta
- `ad_view` - (Agregar desde el frontend)

Puedes consultar analytics con Prisma Studio o crear endpoints de reportes.

## 💰 Monetización

### Implementado
- Banner ads en listas y chat
- Interstitial ads cada 4 búsquedas

### Futuro
- Rewarded ads para features premium
- Modo premium sin ads (Stripe)

## 🛠️ Scripts Útiles

### Backend
```bash
npm run dev              # Servidor con hot-reload
npm run build            # Compilar TypeScript
npm run start            # Servidor producción
npm run prisma:studio    # Ver DB visualmente
npm run prisma:migrate   # Crear migraciones
```

### Frontend
```bash
npm start                # Servidor Expo
npm run android          # Correr en Android
npm run ios              # Correr en iOS (solo Mac)
npm run web              - Correr en navegador
```

## 🧪 Testing Local

### 1. Iniciar PostgreSQL local
```bash
# Con Docker
docker run -d --name foodmagic-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=foodmagic \
  -p 5432:5432 \
  postgres:15
```

### 2. Configurar .env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/foodmagic"
OPENAI_API_KEY="sk-..."
JWT_SECRET="dev-secret"
```

### 3. Correr migraciones
```bash
cd backend
npm run prisma:migrate
```

### 4. Iniciar backend
```bash
npm run dev
```

### 5. Iniciar frontend
```bash
cd foodmagic
npm start
```

## 🔮 Próximos Pasos

1. **Integrar backend en el frontend** - Cambiar llamadas directas a OpenAI por llamadas a tu API
2. **Implementar auth en el frontend** - Pantallas de login/registro
3. **Agregar gestión de favoritos** - UI para guardar recetas
4. **Implementar comunidad** - Listar recetas públicas
5. **Analytics dashboard** - Ver métricas de uso
6. **Testing** - Unit tests y e2e tests
7. **CI/CD** - Automatizar deploys

## 📝 Notas Importantes

- El backend ya está completo y funcional
- El frontend usa OpenAI directamente (cambiar para usar el backend)
- Ambos usan TypeScript
- La base de datos está diseñada para escalar
- Auth con JWT está implementado
- Analytics se guarda automáticamente

## 🦊

¡Tu stack completo está listo! Ahora tienes:

✅ Frontend React Native con ads
✅ Backend Node.js + Express
✅ PostgreSQL con Prisma
✅ Autenticación JWT
✅ OpenAI API integrada
✅ Analytics tracking
✅ Estructura production-ready

¿Quieres que integre el backend en el frontend ahora? 🚀
