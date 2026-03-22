# 🍳 FoodMagic

**Cocina con lo que tienes** - Una app React Native con OpenAI que genera recetas personalizadas basadas en los ingredientes que tienes en casa.

[![GitHub stars](https://img.shields.io/github/stars/gurrion/foodmagic?style=social)](https://github.com/gurrion/foodmagic/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gurrion/foodmagic?style=social)](https://github.com/gurrion/foodmagic/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

### 📱 Frontend (React Native + Expo)
- ✅ **Generación de recetas con IA** - Usa GPT para crear recetas creativas con tus ingredientes
- ✅ **Modo emergencia** - "Solo tengo 3 ingredientes y mucha hambre"
- ✅ **Chat con el chef** - Pregunta sobre sustituciones, técnicas de cocina, tips
- ✅ **Monetización con ads** - Banner ads + Interstitial ads cada 4 búsquedas
- ✅ **Modo normal vs emergencia** - Recetas más elaboradas o super rápidas

### 🖥️ Backend (Node.js + Express)
- ✅ **Autenticación JWT** - Registro, login y gestión de usuarios
- ✅ **Generación de recetas con IA** - OpenAI API integrada
- ✅ **Chat con el chef** - Asistente de cocina virtual
- ✅ **Persistencia de datos** - PostgreSQL + Prisma ORM
- ✅ **Gestión de favoritos** - Guarda tus recetas preferidas
- ✅ **Comunidad** - Compartir recetas públicas
- ✅ **Analytics** - Tracking de eventos para métricas

## 🚀 Quick Start

### Prerrequisitos

- Node.js (v18+)
- PostgreSQL (local o cloud)
- Cuenta en [OpenAI](https://platform.openai.com) para la API key

### 1. Base de Datos

**Opción A: Local con Docker**
```bash
docker run -d --name foodmagic-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=foodmagic \
  -p 5432:5432 \
  postgres:15
```

**Opción B: Cloud (Supabase/Neon/Railway)**
- Crea una cuenta en [Supabase](https://supabase.com) (gratuito)
- Crea un proyecto Postgres
- Copia la DATABASE_URL

### 2. Backend

```bash
cd backend
npm install

# Crear .env
cp .env.example .env

# Editar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/foodmagic"
OPENAI_API_KEY="sk-..."
JWT_SECRET="un-super-secret-key"

# Generar Prisma client y migraciones
npm run prisma:generate
npm run prisma:migrate

# Correr servidor
npm run dev
```

Backend corriendo en: `http://localhost:3001`

### 3. Frontend

```bash
npm install

# Crear .env
echo "EXPO_PUBLIC_API_URL=http://localhost:3001/api" > .env
echo "EXPO_PUBLIC_OPENAI_API_KEY=sk-..." >> .env

# Correr app
npm start
```

Escanea el QR con Expo Go en tu teléfono.

📚 Para más detalles, ver [QUICKSTART.md](./QUICKSTART.md)

## 📁 Estructura del Proyecto

```
foodmagic/
├── 📱 Frontend (React Native)
│   ├── src/screens/ - 4 pantallas
│   ├── src/services/ - OpenAI + Ads
│   └── src/store/ - Zustand state
├── 🖥️ Backend (Node.js)
│   ├── src/controllers/ - Auth + Recipes
│   ├── src/services/ - OpenAI + DB
│   ├── src/routes/ - API endpoints
│   ├── src/middleware/ - JWT auth
│   └── prisma/ - Database schema
└── 📚 Docs
    ├── FULLSTACK.md - Arquitectura completa
    ├── QUICKSTART.md - Setup en 5 pasos
    └── backend/README.md - Backend docs
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

📚 Para más detalles de la API, ver [backend/README.md](./backend/README.md)

## 🛠️ Stack Tecnológico

### Frontend
- **Frontend**: React Native (Expo) + TypeScript
- **Estado**: Zustand
- **Navegación**: React Navigation
- **Ads**: react-native-google-mobile-ads
- **IA**: OpenAI API (GPT-3.5-turbo)
- **Imágenes**: expo-image-picker

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, bcryptjs
- **Logging**: Morgan

## 💰 Monetización

### Implementado
- Banner ads en listas y chat
- Interstitial ads cada 4 búsquedas

### Futuro
- Rewarded ads para features premium
- Modo premium sin ads (Stripe)

## 🚀 Deployment

### Frontend
- **EAS Build** - Para iOS y Android stores
- **Expo Application Services** - Hosting de updates OTA

### Backend
- **Railway** - Postgres + Node.js en un solo lugar
- **Render** - Free tier disponible
- **Fly.io** - Global edge deployment

### Database
- **Supabase** - Postgres con auth gratis
- **Neon** - Postgres serverless
- **Railway** - Postgres integrado

## 📊 Roadmap

- [ ] Reconocimiento de imagen (GPT Vision) para escanear la nevera
- [ ] Modo comunidad: compartir y votar recetas
- [ ] Modo offline con recetas guardadas
- [ ] Filtros: vegetariano, vegano, sin gluten, etc.
- [ ] Timer de cocina integrado
- [ ] Lista de compras automática
- [ ] Modo premium: sin ads, recetas ilimitadas, chat avanzado
- [ ] Testing unitario y e2e
- [ ] CI/CD automatizado

## 🤝 Contributing

Contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👤 Autor

**César Gurrión** - [@gurrion](https://github.com/gurrion)

---

**Built with ❤️ by Alfisa 🦊**

⭐ Si te gusta el proyecto, dale una estrella en GitHub!
