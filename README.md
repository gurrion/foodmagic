# 🍳 FoodMagic

Cocina con lo que tienes - Una app React Native que genera recetas personalizadas basadas en los ingredientes que tienes en casa.

## 🚀 Características

- **Generación de recetas con IA**: Usa GPT para crear recetas creativas con tus ingredientes
- **Modo emergencia**: "Solo tengo 3 ingredientes y mucha hambre"
- **Chat con el chef**: Pregunta sobre sustituciones, técnicas de cocina, tips
- **Monetización con ads**: Banner ads + Interstitial ads cada 4 búsquedas
- **Modo normal vs emergencia**: Recetas más elaboradas o super rápidas

## 📦 Instalación

### Prerrequisitos

- Node.js (v16+)
- npm o yarn
- Expo CLI
- Android Studio / Xcode (para builds nativos)
- Cuenta en [OpenAI](https://platform.openai.com) para la API key
- Cuenta en [AdMob](https://apps.admob.com) para los ads

### Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Editar .env con tu OpenAI API Key
# EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# 4. Ejecutar la app
npm start
```

## 🔑 Configuración

### OpenAI API

1. Ve a https://platform.openai.com/api-keys
2. Crea una API key
3. Agrégala a tu archivo `.env` como `EXPO_PUBLIC_OPENAI_API_KEY`

### AdMob Ads

Para desarrollo, la app usa **TestIds** automáticamente (no necesitas configurar nada).

Para producción:

1. Crea un proyecto en [AdMob Console](https://apps.admob.com)
2. Crea unidades de anuncio:
   - Banner (adaptive)
   - Interstitial
   - Rewarded (opcional, para features premium)
3. Actualiza los IDs en:
   - `app.json` (googleMobileAdsAppId)
   - `src/services/adService.ts` (AD_IDS)
   - `src/components/AdBanner.tsx` (AD_UNIT_ID)
4. Actualiza `PRODUCTION = true` en `src/services/adService.ts`

## 📱 Uso

### Modos de búsqueda

1. **Normal**: Recetas completas con ingredientes adicionales comunes
2. **Emergencia**: Usa SOLO lo que tienes + sal/pimienta/aceite

### Chat con el chef

Pregunta sobre:
- Sustituciones de ingredientes
- Técnicas de cocina
- Ajustes de recetas
- Dudas alimentarias

### Monetización

- **Banner ads**: En listas de recetas
- **Interstitial ads**: Cada 4 búsquedas (no intrusivo)
- **Rewarded ads**: Para features premium (comunidad, favoritos ilimitados)

## 🛠️ Stack Tecnológico

- **Frontend**: React Native (Expo) + TypeScript
- **Estado**: Zustand
- **Navegación**: React Navigation
- **Ads**: react-native-google-mobile-ads
- **IA**: OpenAI API (GPT-3.5-turbo)
- **Imágenes**: expo-image-picker

## 📁 Estructura del Proyecto

```
foodmagic/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   └── AdBanner.tsx
│   ├── navigation/       # Navegación
│   │   └── AppNavigator.tsx
│   ├── screens/          # Pantallas
│   │   ├── HomeScreen.tsx
│   │   ├── RecipesScreen.tsx
│   │   ├── RecipeDetailScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── services/         # Servicios externos
│   │   ├── recipeService.ts  # OpenAI API
│   │   └── adService.ts      # AdMob
│   └── store/            # Estado global
│       └── useStore.ts
├── App.tsx
├── app.json
└── package.json
```

## 🚀 Deployment

### Android

```bash
# Build APK
eas build --platform android --profile preview

# Build para Google Play
eas build --platform android --profile production
```

### iOS

```bash
# Build para TestFlight
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

## 💡 Roadmap

- [ ] Reconocimiento de imagen (GPT Vision) para escanear la nevera
- [ ] Modo comunidad: compartir y votar recetas
- [ ] Modo offline con recetas guardadas
- [ ] Historial de búsquedas
- [ ] Modo premium: sin ads, recetas ilimitadas, chat avanzado
- [ ] Filtros: vegetariano, vegano, sin gluten, etc.
- [ ] Timer de cocina integrado
- [ ] Lista de compras automática

## 📄 Licencia

MIT

---

**Built with ❤️ by Alfisa 🦊**
