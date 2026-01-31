# ✅ Checklist PWA - Nexus Estudio Gráfico

## 🎯 Configuración Completada

### 1. ✅ Manifest (manifest.ts)
- **Ubicación**: `/app/manifest.ts`
- **Propiedades configuradas**:
  - ✅ `name` y `short_name`
  - ✅ `description` completa
  - ✅ `start_url` y `scope`
  - ✅ `display: standalone`
  - ✅ `background_color` y `theme_color`
  - ✅ `orientation`, `lang`, `dir`
  - ✅ `categories` (business, design, productivity)
  - ✅ `icons` (múltiples tamaños incluyendo 192x192 y 512x512)
  - ✅ `shortcuts` (Servicios y Contacto)

### 2. ✅ Service Worker
- **Ubicación**: `/public/sw.js`
- **Estrategia**: Network First con fallback a Cache
- **Registro**: Automático en `layout.tsx`

### 3. ✅ Meta Tags PWA
- ✅ `viewport` configurado correctamente
- ✅ `theme-color` (#8b5cf6)
- ✅ `mobile-web-app-capable`
- ✅ `apple-mobile-web-app-capable`
- ✅ `apple-mobile-web-app-status-bar-style`
- ✅ `apple-mobile-web-app-title`

### 4. ✅ Iconos
- ✅ `/app/icon.png` (192x192 y 512x512 generados por Next.js)
- ✅ `/app/apple-icon.png` (180x180)
- ✅ `/app/favicon.ico`

### 5. ✅ HTTPS
- ✅ Vercel proporciona HTTPS automáticamente

---

## 🧪 Cómo Verificar que Funciona

### **En Chrome Desktop:**

1. **Abrir DevTools** (F12)
2. Ve a la pestaña **Application**
3. En el menú izquierdo, verifica:
   - **Manifest**: Debe mostrar todos los datos correctamente
   - **Service Workers**: Debe aparecer `/sw.js` como activado
4. En la parte superior, busca el botón **"Install app"** o el ícono ➕ en la barra de direcciones
5. Si todo está bien, Chrome mostrará: **"App can be installed"**

### **En Chrome Mobile (Android):**

1. Abre tu sitio en Chrome móvil
2. Después de unos segundos, debe aparecer un **banner en la parte inferior** que dice:
   - "Agregar Nexus a la pantalla de inicio" o
   - "Instalar aplicación"
3. También puedes ir a **Menú (⋮) → Agregar a pantalla de inicio**

### **En Safari (iOS):**

1. Abre tu sitio en Safari
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Debe aparecer con el nombre "Nexus" y tu icono

---

## 🔍 Herramientas de Diagnóstico

### **1. Lighthouse (Chrome DevTools)**
```bash
# En Chrome DevTools:
# 1. F12 → Pestaña "Lighthouse"
# 2. Selecciona "Progressive Web App"
# 3. Click en "Generate report"
# 4. Debe obtener 100/100 en PWA
```

### **2. PWA Builder**
- Visita: https://www.pwabuilder.com/
- Ingresa tu URL: `https://nexustoprint.vercel.app`
- Te mostrará un análisis completo y qué falta (si algo)

### **3. Chrome DevTools - Application Tab**
```
Application → Manifest
- Verifica que todos los campos estén completos
- Verifica que los iconos se carguen correctamente

Application → Service Workers
- Debe mostrar "activated and is running"
```

---

## 📱 Criterios de Instalabilidad de Chrome

Para que Chrome muestre el prompt de instalación, DEBE cumplir:

1. ✅ **Servido sobre HTTPS** (Vercel lo hace automáticamente)
2. ✅ **Manifest válido** con:
   - ✅ `name` o `short_name`
   - ✅ `icons` incluyendo 192x192 y 512x512
   - ✅ `start_url`
   - ✅ `display` debe ser `standalone`, `fullscreen`, o `minimal-ui`
3. ✅ **Service Worker registrado** con evento `fetch`
4. ⚠️ **El usuario debe interactuar con el sitio** (al menos 30 segundos de navegación)

---

## 🚀 Próximos Pasos Opcionales

### **Screenshots para App Stores**
Puedes agregar screenshots al manifest para que se vean en el diálogo de instalación:

```typescript
// En manifest.ts, agregar:
screenshots: [
    {
        src: '/screenshot-mobile.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow'
    },
    {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide'
    }
]
```

### **Notificaciones Push** (Opcional)
Si quieres enviar notificaciones push a los usuarios que instalen la app.

### **Modo Offline Mejorado**
Actualmente el Service Worker cachea recursos básicos. Podrías expandirlo para cachear más contenido.

---

## 🐛 Troubleshooting

### **"El prompt de instalación no aparece"**
- Verifica que hayas navegado por el sitio al menos 30 segundos
- Asegúrate de que el Service Worker esté registrado (DevTools → Application → Service Workers)
- Verifica que el manifest sea válido (DevTools → Application → Manifest)
- Intenta en modo incógnito (a veces Chrome cachea el estado)

### **"Service Worker no se registra"**
- Verifica la consola del navegador para errores
- Asegúrate de que `/sw.js` esté accesible en `/public/sw.js`
- Verifica que no haya errores de sintaxis en `sw.js`

### **"Los iconos no se ven"**
- Verifica que `/app/icon.png` y `/app/apple-icon.png` existan
- Asegúrate de que sean PNG válidos
- Verifica en DevTools → Network que se estén cargando correctamente

---

## 📊 Métricas de Éxito

Una PWA bien configurada debe tener:
- ✅ **Lighthouse PWA Score**: 100/100
- ✅ **Instalable** en Chrome Desktop y Mobile
- ✅ **Funciona offline** (al menos página de inicio)
- ✅ **Carga rápida** (< 3 segundos)
- ✅ **Responsive** en todos los dispositivos

---

## 📚 Recursos Adicionales

- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Chrome - Install Criteria](https://web.dev/install-criteria/)
- [Next.js - PWA](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
