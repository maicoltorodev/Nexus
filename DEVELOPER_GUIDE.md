# 📘 Guía del Desarrollador - Estudio Gráfico Nexus

Bienvenido al proyecto **Estudio Gráfico Nexus**. Este documento está diseñado para ayudarte a entender la arquitectura, las tecnologías y los flujos de trabajo del proyecto. Su objetivo es facilitar la incorporación de nuevos desarrolladores y proporcionar contexto a asistentes de IA para evitar errores y mejorar la colaboración.

---

## 🚀 1. Visión General del Proyecto

Esta aplicación es una **Progressive Web App (PWA)** construida con **Next.js 16**. Sirve como el sitio web principal y plataforma de gestión para "Estudio Gráfico Nexus".

### Funcionalidades Principales:
-   **Sitio Público:** Landing page, servicios, portafolio y contacto.
-   **Panel de Administración (`/admin`):** Gestión de clientes, proyectos y archivos.
-   **Seguimiento de Clientes:** Área donde los clientes pueden ver el estado de sus proyectos.
-   **PWA:** Instalable en dispositivos móviles y de escritorio.

---

## 🛠 2. Stack Tecnológico

El proyecto utiliza tecnologías modernas y robustas:

### Core
-   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animaciones:** [Framer Motion](https://www.framer.com/motion/)

### Base de Datos & Backend
-   **Base de Datos:** PostgreSQL (alojada en Vercel Postgres)
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) - Para interactuar con la DB de forma segura y tipada.
-   **Autenticación:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/) - Estrategia de Credenciales.
-   **Almacenamiento de Archivos:** Vercel Blob (para imágenes y documentos).

### Herramientas
-   **Iconos:** Lucide React
-   **Encriptación:** bcryptjs
-   **Linting:** ESLint

---

## 📂 3. Estructura del Proyecto

```
/
├── app/                    # Rutas de la aplicación (App Router)
│   ├── admin/              # Panel de administración (Protegido)
│   ├── api/                # API Routes (NextAuth, etc.)
│   ├── planes/             # Página de planes
│   ├── seguimiento/        # Página de seguimiento para clientes
│   ├── layout.tsx          # Layout principal (RootLayout)
│   └── page.tsx            # Landing page (Home)
├── components/             # Componentes de React reutilizables
│   ├── admin/              # Componentes específicos del admin
│   └── ui/                 # Componentes de interfaz (Botones, Cards, etc.)
├── lib/                    # Lógica de negocio y utilidades
│   ├── db/                 # Configuración de Drizzle y Schema
│   │   ├── schema.ts       # Definición de tablas de la DB
│   │   └── index.ts        # Cliente de la DB
│   └── actions.ts          # Server Actions (si aplica)
├── public/                 # Archivos estáticos y configuración PWA
│   ├── sw.js               # Service Worker
│   └── ...imagenes
├── auth.ts                 # Configuración de NextAuth
├── middleware.ts           # Middleware para protección de rutas
├── drizzle.config.ts       # Configuración de Drizzle Kit
└── next.config.ts          # Configuración de Next.js
```

---

## ⚡ 4. Configuración y Puesta en Marcha

### Prerrequisitos
-   Node.js (LTS recomendado)
-   npm o pnpm

### Instalación
1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno (`.env`):
    ```env
    POSTGRES_URL="postgres://..."
    POSTGRES_PRISMA_URL="postgres://..."
    POSTGRES_URL_NO_SSL="postgres://..."
    POSTGRES_USER="..."
    POSTGRES_HOST="..."
    POSTGRES_PASSWORD="..."
    POSTGRES_DATABASE="..."
    
    BLOB_READ_WRITE_TOKEN="..."
    
    AUTH_SECRET="tu_secreto_generado_con_openssl"
    ```

### Ejecución
-   **Desarrollo:** `npm run dev`
-   **Build:** `npm run build`
-   **Lint:** `npm run lint`
-   **Gestión DB (Drizzle):**
    -   Generar migraciones: `npx drizzle-kit generate`
    -   Aplicar cambios: `npx drizzle-kit migrate` (o `push` si es dev)

---

## 💾 5. Modelo de Datos (Base de Datos)

El esquema está definido en `lib/db/schema.ts`. Las tablas principales son:

1.  **usuarios_admin**: Administradores del sistema (Acceso al panel).
2.  **clientes**: Información de los clientes (Nombre, Cédula, Contacto).
3.  **proyectos**: Proyectos asociados a clientes (Estado, Progreso, Plan).
    -   Relación: Un Cliente tiene muchos Proyectos.
4.  **archivos**: Archivos adjuntos a proyectos.
    -   Relación: Un Proyecto tiene muchos Archivos.

---

## 🔒 6. Autenticación y Seguridad

-   **Sistema:** NextAuth v5.
-   **Método:** Credenciales (Email/Password).
-   **Protección:** El archivo `middleware.ts` intercepta las rutas bajo `/admin`. Si no hay sesión activa, redirige a `/admin/login`.
-   **Usuarios:** Se validan contra la tabla `usuarios_admin` usando `bcrypt` para comparar contraseñas.

---

## 📱 7. PWA (Progressive Web App)

El proyecto está configurado como una PWA para permitir instalación y uso offline básico.
-   **Manifest:** Generado dinámicamente en `app/manifest.ts`.
-   **Service Worker:** Ubicado en `public/sw.js`.
-   **Iconos:** Definidos en `app/icon.png`, `app/apple-icon.png`.

---

## ⚠️ 8. Consideraciones Importantes para Desarrolladores

1.  **Server Components vs Client Components:**
    -   Por defecto, todo en `app/` es Server Component.
    -   Usa `'use client'` al inicio del archivo solo si necesitas interactividad (useState, useEffect, eventos onClick).

2.  **Manejo de Base de Datos:**
    -   Usa siempre Drizzle ORM para consultas. Evita SQL crudo a menos que sea estrictamente necesario.
    -   Las consultas a DB deben hacerse preferiblemente en Server Components o Server Actions.

3.  **Estilos:**
    -   Usa clases de Tailwind CSS. Evita crear archivos CSS separados a menos que sea para configuraciones globales.

4.  **Despliegue:**
    -   Al desplegar en Vercel, asegúrate de que las variables de entorno estén configuradas en el panel de Vercel.
    -   Las migraciones de base de datos deben ejecutarse con cuidado en producción.

5.  **Convenciones:**
    -   Nombres de carpetas en minúsculas y guiones (`mi-componente`).
    -   Componentes en PascalCase (`MiComponente.tsx`).
    -   Mantén la lógica de negocio separada de la UI tanto como sea posible.

---

*Este documento fue generado para facilitar el mantenimiento y escalabilidad del proyecto Estudio Gráfico Nexus.*
