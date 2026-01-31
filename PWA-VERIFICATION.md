# 🔍 Verificación PWA - Nexus Estudio Gráfico

## ✅ Cambios Recientes Aplicados

### 1. **Service Worker Mejorado** (`/public/sw.js`)
- ✅ Corregidas las rutas de caché (eliminadas referencias a archivos inexistentes)
- ✅ Mejorado el manejo de errores
- ✅ Solo cachea peticiones GET
- ✅ Fallback mejorado para navegación offline

### 2. **Colores de Selección Personalizados**
- ✅ Agregados en `layout.tsx` para toda la app
- ✅ Coinciden con la página de planes (dorado #FFD700)

---

## 🎯 Pasos para Verificar la Instalabilidad

### **Paso 1: Verificar en Producción**

1. **Accede a tu sitio en producción:**
   ```
   https://nexustoprint.vercel.app
   ```

2. **Abre Chrome DevTools** (F12)

3. **Ve a la pestaña "Application"**

4. **Verifica el Manifest:**
   - Click en "Manifest" en el menú izquierdo
   - Debe mostrar:
     - ✅ Name: "Nexus Estudio Gráfico"
     - ✅ Short name: "Nexus"
     - ✅ Start URL: "/"
     - ✅ Display: "standalone"
     - ✅ Icons: Debe mostrar los iconos (192x192, 512x512, etc.)
   
   **Si ves errores aquí, toma screenshot y compártelo**

5. **Verifica el Service Worker:**
   - Click en "Service Workers" en el menú izquierdo
   - Debe mostrar: `sw.js` con estado "activated and is running"
   - Si no aparece o está en error, revisa la consola

6. **Verifica la Consola:**
   - Ve a la pestaña "Console"
   - Busca mensajes como:
     - ✅ "Service Worker registrado con éxito"
     - ✅ "Cache abierto"
   - ❌ Si ves errores en rojo, anótalos

---

### **Paso 2: Ejecutar Lighthouse**

1. En Chrome DevTools, ve a la pestaña **"Lighthouse"**

2. Selecciona:
   - ✅ Progressive Web App
   - ✅ Desktop o Mobile (prueba ambos)

3. Click en **"Generate report"**

4. **Resultados esperados:**
   - PWA Score: **90-100/100**
   - ✅ "Installable"
   - ✅ "PWA Optimized"

5. **Si el score es bajo:**
   - Revisa la sección "PWA" del reporte
   - Anota qué checks fallan (aparecerán en rojo)

---

### **Paso 3: Verificar Criterios de Instalación**

Chrome mostrará el botón de instalación SOLO si se cumplen TODOS estos criterios:

#### ✅ **Criterios Técnicos:**
1. ✅ Servido sobre HTTPS (Vercel lo hace automáticamente)
2. ✅ Manifest válido con:
   - name o short_name
   - icons (192x192 y 512x512)
   - start_url
   - display: standalone
3. ✅ Service Worker registrado con evento fetch
4. ✅ Service Worker debe controlar la página

#### ⚠️ **Criterios de Comportamiento del Usuario:**
5. **El usuario debe interactuar con el sitio:**
   - Navegar por al menos **30 segundos**
   - Hacer scroll, clicks, etc.
   - Chrome evalúa "engagement" del usuario

6. **No debe haberse rechazado antes:**
   - Si el usuario rechazó la instalación antes, Chrome esperará varios días antes de volver a preguntar
   - **Solución:** Prueba en modo incógnito o en otro dispositivo

---

### **Paso 4: Probar Instalación**

#### **En Desktop (Chrome):**

1. Navega por el sitio al menos 30 segundos
2. Busca el ícono de instalación:
   - En la barra de direcciones (lado derecho): ícono ➕ o 💻
   - O en el menú de Chrome (⋮) → "Instalar Nexus..."

3. Si NO aparece:
   - Abre DevTools → Application → Manifest
   - En la parte superior debe decir: **"App can be installed"** o mostrar un error específico

#### **En Mobile (Android - Chrome):**

1. Abre el sitio en Chrome móvil
2. Navega por 30 segundos
3. Debe aparecer un **banner en la parte inferior**:
   - "Agregar Nexus a la pantalla de inicio"
4. O ve a: Menú (⋮) → "Agregar a pantalla de inicio"

#### **En iOS (Safari):**

1. Abre el sitio en Safari
2. Toca el botón **Compartir** (⬆️)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Debe mostrar el nombre "Nexus" y el icono correcto

---

## 🐛 Problemas Comunes y Soluciones

### **Problema 1: "El manifest no se carga"**

**Síntomas:**
- DevTools → Application → Manifest muestra error
- Dice "No manifest detected"

**Solución:**
```bash
# Verifica que el archivo manifest.ts esté en /app/
# Next.js lo genera automáticamente en /manifest.webmanifest

# Prueba accediendo directamente:
https://nexustoprint.vercel.app/manifest.webmanifest
```

**Si no carga:**
- Verifica que `manifest.ts` esté en `/app/manifest.ts`
- Haz rebuild del proyecto
- Verifica que no haya errores de sintaxis en `manifest.ts`

---

### **Problema 2: "Service Worker no se registra"**

**Síntomas:**
- DevTools → Application → Service Workers está vacío
- Consola muestra: "Failed to register service worker"

**Solución:**
1. Verifica que `/public/sw.js` exista
2. Accede directamente: `https://nexustoprint.vercel.app/sw.js`
3. Si da 404, el archivo no se está sirviendo
4. Verifica que el código de registro en `layout.tsx` esté correcto

---

### **Problema 3: "Los iconos no se ven"**

**Síntomas:**
- DevTools → Application → Manifest muestra iconos rotos
- Los iconos no cargan

**Solución:**
```bash
# Verifica que existan:
/app/icon.png        # Next.js genera /icon
/app/apple-icon.png  # Next.js genera /apple-icon
/app/favicon.ico

# Prueba accediendo directamente:
https://nexustoprint.vercel.app/icon
https://nexustoprint.vercel.app/apple-icon
```

---

### **Problema 4: "El botón de instalación no aparece"**

**Causas posibles:**

1. **No has navegado suficiente tiempo:**
   - Navega por el sitio al menos 30-60 segundos
   - Haz scroll, clicks, interactúa con el contenido

2. **Ya rechazaste la instalación antes:**
   - Chrome recuerda si rechazaste y no volverá a preguntar por varios días
   - **Solución:** Prueba en modo incógnito o en otro navegador/dispositivo

3. **El sitio no cumple todos los criterios:**
   - Ejecuta Lighthouse y revisa qué falta
   - Verifica DevTools → Application → Manifest

4. **Cache del navegador:**
   - Limpia la cache: DevTools → Application → Clear storage → Clear site data
   - Recarga la página con Ctrl+Shift+R

---

## 🧪 Comandos de Verificación Rápida

### **1. Verificar que el proyecto compile sin errores:**
```bash
npm run build
```

### **2. Probar localmente:**
```bash
npm run dev
# Abre http://localhost:3000
# Nota: Service Workers requieren HTTPS, así que algunas funciones PWA no funcionarán en local
```

### **3. Verificar en producción:**
```bash
# Asegúrate de que los cambios estén en producción
# Si usas Vercel, cada push a main despliega automáticamente
```

---

## 📊 Checklist Final

Antes de declarar que la PWA está lista, verifica:

- [ ] **Manifest accesible:** `https://nexustoprint.vercel.app/manifest.webmanifest` carga sin errores
- [ ] **Service Worker activo:** DevTools → Application → Service Workers muestra "activated"
- [ ] **Iconos cargan:** DevTools → Application → Manifest muestra todos los iconos
- [ ] **Lighthouse PWA:** Score de 90+ en PWA
- [ ] **Instalable en Desktop:** Aparece botón de instalación en Chrome
- [ ] **Instalable en Mobile:** Aparece banner o opción en menú
- [ ] **Funciona offline:** Desconecta internet y recarga, debe mostrar algo (aunque sea la página cacheada)

---

## 🚀 Próximos Pasos Recomendados

### **1. Screenshots para el Manifest (Opcional pero Recomendado)**

Agrega screenshots al manifest para que se vean en el diálogo de instalación:

```typescript
// En /app/manifest.ts, agregar después de icons:
screenshots: [
    {
        src: '/screenshot-mobile.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Vista móvil de Nexus'
    },
    {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Vista de escritorio de Nexus'
    }
]
```

### **2. Mejorar el Offline Experience**

Actualmente el SW cachea lo básico. Podrías:
- Cachear más páginas importantes
- Crear una página offline personalizada
- Cachear imágenes y assets críticos

### **3. Add to Home Screen Prompt Personalizado**

Puedes crear tu propio botón de instalación:

```typescript
// Ejemplo de código para capturar el evento beforeinstallprompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar tu propio botón de instalación
});
```

---

## 📞 Soporte

Si después de seguir todos estos pasos aún no funciona:

1. **Toma screenshots de:**
   - DevTools → Application → Manifest
   - DevTools → Application → Service Workers
   - DevTools → Console (si hay errores)
   - Lighthouse Report (sección PWA)

2. **Anota:**
   - Navegador y versión
   - Sistema operativo
   - URL exacta donde estás probando
   - Pasos que seguiste

3. **Herramientas adicionales:**
   - [PWA Builder](https://www.pwabuilder.com/) - Analiza tu PWA
   - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Testing automatizado

---

## 🎉 Cuando Todo Funcione

Una vez que la PWA esté instalable:

1. **Promociona la instalación:**
   - Agrega un botón "Instalar App" en tu sitio
   - Menciona en redes sociales que tu sitio es instalable
   - Agrega un banner sutil invitando a instalar

2. **Monitorea el uso:**
   - Google Analytics puede trackear instalaciones
   - Verifica cuántos usuarios instalan vs. solo visitan

3. **Mantén actualizado:**
   - Cuando actualices el sitio, incrementa la versión del cache en `sw.js`
   - Considera implementar un sistema de actualización automática

---

**Última actualización:** 2026-01-30
**Versión del Service Worker:** nexus-pwa-v1
