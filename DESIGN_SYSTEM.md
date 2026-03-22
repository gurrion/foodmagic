# 🎨 FoodMagic Design System

## Overview
FoodMagic ahora utiliza un sistema de diseño completo y consistente que mejora significativamente la experiencia de usuario (UX) y la interfaz de usuario (UI).

## 📐 Design Tokens

### Colors
- **Primary (Purple)**: Apariencia premium, creativa y moderna
  - 50-900: Paleta completa para diferentes usos
  - 600: Color principal para acciones

- **Accent (Gourmet Gold)**: Para llamadas a la acción secundarias y elementos destacados
  - Evoca el mundo culinario y la calidad

- **Success (Fresh Green)**: Para indicar estados positivos, dificultad "fácil"

- **Danger (Alert Red)**: Para errores, estados negativos, dificultad "difícil"

- **Neutral (Gray Scale)**: Para backgrounds, texto secundario, borders
  - 0-1000: Escala completa de grises

### Typography
- **Font Sizes**: 12px - 48px (xs - 5xl)
- **Font Weights**: Light, Normal, Medium, Semibold, Bold
- **Line Heights**: Tight (1.2), Normal (1.5), Relaxed (1.75)
- **Font Family**: System (adaptable a cada plataforma)

### Spacing
- **Scale**: 4px base (4, 8, 16, 24, 32, 48, 64px)
- **Tokens**: xs, sm, md, lg, xl, xxl, xxxl

### Border Radius
- **sm**: 4px (botones pequeños, tags)
- **md**: 8px (inputs, cards internas)
- **lg**: 12px (cards principales, botones)
- **xl**: 16px (modales, secciones destacadas)
- **full**: 9999px (botones redondos, avatares)

### Shadows
- **xs**: Elevación sutil (1px)
- **sm**: Elevación ligera (2px)
- **md**: Elevación media (4px) - cards
- **lg**: Elevación alta (8px) - modales
- **xl**: Elevación máxima (12px) - overlays

### Opacity
- **disabled**: 0.38
- **hover**: 0.8
- **pressed**: 0.6
- **overlay**: 0.5

## 🧩 Components

### Button
- **Variants**: primary, secondary, success, danger, outline, ghost
- **Sizes**: sm, md, lg
- **Features**: loading state, icon support, disabled state, fullWidth

### Card
- **Variants**: elevated, outlined, flat
- **Elevations**: xs, sm, md, lg, xl
- **Padding**: none, sm, md, lg
- **Features**: pressable, optional elevation

### Input
- **Features**: label, error state, icon support, custom styling
- **States**: normal, error, disabled

### Badge
- **Variants**: primary, success, danger, warning, info
- **Sizes**: sm, md
- **Features**: icon support, semantic colors

### SkeletonLoader
- **Purpose**: Estados de carga con feedback visual
- **Variants**: Simple loader, Card skeleton, List skeleton

### EmptyState
- **Purpose**: Estados vacíos atractivos y accionables
- **Variants**: Genérico, RecipeEmptyState, IngredientEmptyState
- **Features**: Icon, title, description, action button

## 🎯 Design Principles

### 1. Visual Hierarchy
- Títulos grandes y en negrita
- Texto secundario más pequeño y en gris
- Uso de color para guiar la atención

### 2. Spacing Consistency
- Espaciado basado en tokens (4px scale)
- Padding y margin predecibles
- Espacio en blanco intencional

### 3. Accessibility
- Alto contraste para texto (WCAG AA)
- Tamaño de toque mínimo 44x44px
- Estados claros (pressed, disabled, loading)

### 4. Feedback Visual
- Shadows indican elevación y profundidad
- Estados hover y pressed para interactividad
- Skeleton loaders para estados de carga

### 5. Consistency
- Colores y estilos centralizados
- Componentes reutilizables
- Patrones predecibles

## 📱 Screen Improvements

### HomeScreen
- ✅ Mejor visual hierarchy con header destacado
- ✅ Selector de modo más claro y visual
- ✅ Cards para ingredientes con mejor visual
- ✅ Empty states atractivos cuando no hay ingredientes
- ✅ Botones con mejor visual hierarchy
- ✅ Chat CTA más prominente y atractivo
- ✅ Espaciado consistente

### RecipesScreen
- ✅ Cards con más información (calorías, tags)
- ✅ Skeleton loaders durante carga
- ✅ Badges semánticos para dificultad
- ✅ Mejor visual hierarchy en recetas
- ✅ Preview de ingredientes más visible
- ✅ Tags para categorías adicionales

### RecipeDetailScreen
- ✅ Title card con información clave
- ✅ Numeración clara de ingredientes e instrucciones
- ✅ Pasos numerados con visual destacado
- ✅ Tips del Chef con diseño especial
- ✅ FAB (Floating Action Buttons) para acciones rápidas
- ✅ Mejor legibilidad con espaciado

### ChatScreen
- ✅ Avatar del Chef en mensajes
- ✅ Burbujas de chat mejoradas
- ✅ Timestamp en mensajes
- ✅ Typing indicator animado
- ✅ Preguntas frecuentes (quick questions)
- ✅ Header con estado online
- ✅ Input más grande y cómodo

## 🔧 Usage Examples

### Using Components

```tsx
import { Button, Card, Input, Badge } from '../components';

// Button
<Button
  title="Generar recetas"
  onPress={handleSearch}
  variant="primary"
  size="lg"
  fullWidth
/>

// Card
<Card elevation="sm" padding="md">
  <Text>Content here</Text>
</Card>

// Input
<Input
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
  error={error}
  icon="📧"
/>

// Badge
<Badge text="Fácil" variant="success" size="sm" />
```

### Using Theme

```tsx
import { Theme } from '../theme/theme';

// Colors
backgroundColor: Theme.colors.background.light
textColor: Theme.colors.neutral[800]

// Spacing
padding: Theme.spacing.lg
margin: Theme.spacing.md

// Typography
fontSize: Theme.typography.fontSize.lg
fontWeight: Theme.typography.fontWeight.bold

// Shadows
...Theme.shadows.md

// Border Radius
borderRadius: Theme.borderRadius.lg
```

## 🚀 Future Enhancements

- [ ] Dark mode support
- [ ] Animations y transiciones (React Native Reanimated)
- [ ] Custom fonts
- [ ] Modal components
- [ ] Bottom sheets
- [ ] Toast notifications
- [ ] Pull to refresh
- [ ] Swipe actions en listas
- [ ] Onboarding screens
- [ ] Settings screen con preferencias

## 📊 Before vs After

### Before
- ❌ Sin sistema de diseño centralizado
- ❌ Estilos hardcoded y duplicados
- ❌ Sin skeleton loaders
- ❌ Empty states básicos
- ❌ Sin visual hierarchy clara
- ❌ Espaciado inconsistente
- ❌ Sin feedback visual apropiado

### After
- ✅ Sistema de diseño completo con tokens
- ✅ Componentes reutilizables
- ✅ Skeleton loaders para carga
- ✅ Empty states atractivos y accionables
- ✅ Visual hierarchy clara
- ✅ Espaciado consistente basado en tokens
- ✅ Feedback visual (shadows, pressed states, loading)

## 🎯 Next Steps

1. **Testing**: Probar todas las pantallas en iOS y Android
2. **Refinement**: Ajustar detalles basado en feedback
3. **Animation**: Agregar animaciones sutiles (Reanimated)
4. **Dark Mode**: Implementar soporte para modo oscuro
5. **Analytics**: Rastrear interacciones y mejorar UX

---

**Created**: 2026-03-22
**Designer**: Alfisa (AI Assistant) 🦊
**Version**: 1.0.0
