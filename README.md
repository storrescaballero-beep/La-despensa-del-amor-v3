# 🛒 La Despensa del Amor

App de lista de la compra compartida en tiempo real para dos personas, con generador de menú semanal con IA.

---

## 🚀 Cómo desplegarla (15 minutos)

### Paso 1 — Supabase (base de datos)

1. Ve a [supabase.com](https://supabase.com) y abre tu proyecto
2. Ve a **SQL Editor** y pega todo el contenido de `supabase-schema.sql`
3. Haz clic en **Run** — esto crea las tablas y activa el tiempo real
4. Ve a **Settings > API** y copia:
   - `Project URL` → es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 2 — Anthropic API Key

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una API Key
3. Guárdala como `ANTHROPIC_API_KEY`

### Paso 3 — Vercel (deploy)

1. Sube esta carpeta a un repo de GitHub (nuevo repo, arrástralo todo)
2. Ve a [vercel.com](https://vercel.com) > **Add New Project** > importa el repo
3. Antes de hacer deploy, en **Environment Variables** añade las 3 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
   ANTHROPIC_API_KEY            = sk-ant-xxx...
   ```
4. Haz clic en **Deploy** — en 2 minutos tienes la URL

### Paso 4 — Instalarla en el móvil (PWA)

**En iPhone:**
1. Abre la URL de Vercel en Safari
2. Pulsa el botón de compartir (cuadrado con flecha)
3. Elige **"Añadir a pantalla de inicio"**
4. Ya la tienes como app nativa 🎉

**En Android:**
1. Abre la URL en Chrome
2. Pulsa el menú (tres puntos)
3. Elige **"Añadir a pantalla de inicio"** o **"Instalar app"**

### Paso 5 — Compartirla con tu pareja

Envíale la URL de Vercel. Que la instale en su móvil siguiendo el Paso 4.
**La lista se actualiza en tiempo real entre los dos.**

---

## ✨ Funcionalidades

- ✅ Lista de la compra compartida con sincronización en tiempo real (Supabase Realtime)
- ✅ Categorías: fruta, carne, lácteos, pan, despensa, limpieza, bebidas, otros
- ✅ Control de cantidades por producto
- ✅ Marcar productos como "en el carro" (se tachan)
- ✅ Identificar quién añadió cada producto
- ✅ Generador de menú semanal con IA (Claude)
- ✅ Añadir ingredientes del menú directamente a la lista
- ✅ PWA instalable en iPhone y Android

---

## 🛠 Stack técnico

- **Next.js 14** (App Router)
- **Supabase** (Postgres + Realtime)
- **Anthropic Claude** (generación de menús)
- **Vercel** (deploy)
- **CSS Modules** (estilos)
