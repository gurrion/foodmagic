# 🚀 Quick Start - FoodMagic Full Stack

## 🎯 Qué tienes ahora

Un app completa con:
- ✅ **Frontend**: React Native + Expo + TypeScript
- ✅ **Backend**: Node.js + Express + TypeScript
- ✅ **Database**: PostgreSQL + Prisma ORM
- ✅ **Auth**: JWT authentication
- ✅ **IA**: OpenAI API integrada
- ✅ **Monetización**: AdMob ads listos

## 📦 Setup en 5 pasos

### 1. Base de Datos (PostgreSQL)

**Opción A: Local con Docker**
```bash
docker run -d --name foodmagic-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=foodmagic \
  -p 5432:5432 \
  postgres:15
```

**Opción B: Cloud (Supabase/Neon/Railway)**
- Crea una cuenta en Supabase (gratuito)
- Crea un proyecto Postgres
- Copia la DATABASE_URL

### 2. Backend

```bash
cd foodmagic/backend
npm install

# Crear .env
cp .env.example .env

# Editar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/foodmagic"
OPENAI_API_KEY="sk-tu-openai-api-key"
JWT_SECRET="un-super-secret-key"

# Generar Prisma client
npm run prisma:generate

# Crear tablas en la DB
npm run prisma:migrate

# Correr servidor
npm run dev
```

Backend corriendo en: `http://localhost:3001`

### 3. Frontend

```bash
cd foodmagic
npm install

# Crear .env
echo "EXPO_PUBLIC_API_URL=http://localhost:3001/api" > .env
echo "EXPO_PUBLIC_OPENAI_API_KEY=sk-tu-openai-api-key" >> .env

# Correr app
npm start
```

Escanea el QR con Expo Go en tu teléfono.

### 4. Probar la API

**Registrar usuario:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Generar recetas:**
```bash
curl -X POST http://localhost:3001/api/recipes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "ingredients": ["huevos", "tomate", "queso"],
    "mode": "normal"
  }'
```

### 5. Ver Base de Datos

```bash
cd foodmagic/backend
npm run prisma:studio
```

Abre http://localhost:5555 para ver la DB visualmente.

## 🔌 Integración Pendiente

El frontend todavía llama a OpenAI directamente. Para usar tu backend:

1. Actualizar `src/services/recipeService.ts` en el frontend
2. Reemplazar llamadas directas a OpenAI con llamadas a tu API
3. Agregar pantallas de login/registro
4. Guardar token JWT en AsyncStorage
5. Actualizar headers en todas las peticiones

## 📊 Architecture

```
React Native App (Expo)
    ↓ HTTP/REST
Node.js Backend (Express)
    ↓ SQL
PostgreSQL Database
    ↓ AI
OpenAI API
```

## 🛠️ Comandos útiles

### Backend
```bash
npm run dev              # Iniciar servidor (hot-reload)
npm run build            # Compilar para producción
npm run prisma:studio    # Ver DB visualmente
npm run prisma:migrate   # Crear/actualizar tablas
```

### Frontend
```bash
npm start                # Iniciar Expo
npm run android          # Emulador Android
npm run ios              # Emulador iOS (Mac)
```

## 🚨 Troubleshooting

### Backend no inicia
- Verifica que PostgreSQL esté corriendo
- Verifica DATABASE_URL en .env
- Verifica que el puerto 3001 esté libre

### Migraciones fallan
- Asegúrate que la DB existe
- Borra el contenedor Docker y crea uno nuevo
- Verifica credenciales en DATABASE_URL

### Frontend no conecta
- Verifica que el backend esté corriendo
- En emulador Android usa `http://10.0.2.2:3001/api`
- En emulador iOS usa `http://localhost:3001/api`
- En dispositivo real usa tu IP local: `http://192.168.1.X:3001/api`

## 📚 Documentación

- **Backend**: `/foodmagic/backend/README.md`
- **Frontend**: `/foodmagic/README.md`
- **Full Stack**: `/foodmagic/FULLSTACK.md`
- **Setup inicial**: `/foodmagic/SETUP.md`

## 🎯 Next Steps

1. ✅ Backend listo
2. ✅ Frontend listo
3. ⏳ Integrar backend en el frontend
4. ⏳ Implementar auth screens
5. ⏳ Deploy a producción

---

¿Quieres que integre el backend en el frontend ahora? 🦊
