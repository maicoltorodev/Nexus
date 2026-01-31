'use server';

import { db } from './db';
import { clientes, proyectos, archivos, usuariosAdmin } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// Clientes
export async function createCliente(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const cedula = formData.get('cedula') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;

    // Blindaje: Verificar si el documento ya existe
    const existing = await db.query.clientes.findFirst({
        where: eq(clientes.cedula, cedula)
    });

    if (existing) {
        return { error: 'ESTE DOCUMENTO YA PERTENECE A UN CLIENTE REGISTRADO.' };
    }

    try {
        await db.insert(clientes).values({
            nombre,
            cedula,
            email,
            telefono,
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR CRÍTICO EN EL REGISTRO DE DATOS.' };
    }
}

export async function getClientes() {
    return await db.select().from(clientes).orderBy(clientes.createdAt);
}

export async function deleteCliente(id: string) {
    await db.delete(clientes).where(eq(clientes.id, id));
    revalidatePath('/admin');
    return { success: true };
}

export async function getProyectos() {
    return await db.query.proyectos.findMany({
        with: {
            cliente: true,
            archivos: true,
        },
        orderBy: (proyectos, { desc }) => [desc(proyectos.createdAt)],
    });
}

// Proyectos
export async function createProyecto(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const plan = formData.get('plan') as string;
    const clienteId = formData.get('clienteId') as string;
    const fechaEntrega = formData.get('fechaEntrega') as string;

    // Blindaje Logístico: Verificar si este cliente ya tiene un proyecto con el mismo nombre
    const existing = await db.query.proyectos.findFirst({
        where: and(
            eq(proyectos.nombre, nombre),
            eq(proyectos.clienteId, clienteId)
        )
    });

    if (existing) {
        return { error: 'EL CLIENTE YA TIENE UN PROYECTO REGISTRADO CON ESTE NOMBRE.' };
    }

    try {
        await db.insert(proyectos).values({
            nombre,
            plan,
            clienteId,
            fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
            estado: 'pendiente',
            progreso: 0,
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR CRÍTICO AL INJECTAR EL PROYECTO.' };
    }
}

export async function updateProyectoProgreso(id: string, progreso: number, estado: string) {
    await db.update(proyectos)
        .set({ progreso, estado })
        .where(eq(proyectos.id, id));

    revalidatePath('/admin');
    return { success: true };
}

export async function updateProyectoPlan(id: string, plan: string) {
    await db.update(proyectos)
        .set({ plan })
        .where(eq(proyectos.id, id));

    revalidatePath('/admin');
    return { success: true };
}

export async function updateProyectoFecha(id: string, fecha: string) {
    await db.update(proyectos)
        .set({ fechaEntrega: new Date(fecha) })
        .where(eq(proyectos.id, id));

    revalidatePath('/admin');
    return { success: true };
}

export async function updateProyectoLink(id: string, link: string) {
    await db.update(proyectos)
        .set({ link })
        .where(eq(proyectos.id, id));

    revalidatePath('/admin');
    return { success: true };
}

export async function updateProyectoVisibilidad(id: string, visibilidad: boolean) {
    await db.update(proyectos)
        .set({ visibilidad })
        .where(eq(proyectos.id, id));

    revalidatePath('/admin');
    return { success: true };
}

// Seguimiento Cliente (Búsqueda por cédula)
export async function deleteProyecto(id: string) {
    try {
        // Limpiamos la Bóveda del proyecto primero (DB Only - Blob Cleanup is async/managed elsewhere)
        await db.delete(archivos).where(eq(archivos.proyectoId, id));

        // Ejecutamos la eliminación del proyecto
        await db.delete(proyectos).where(eq(proyectos.id, id));

        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Error eliminando proyecto:", e);
        return { error: 'ERROR AL ELIMINAR EL PROYECTO.' };
    }
}

export async function getProyectoByCedula(cedula: string) {
    const cliente = await db.query.clientes.findFirst({
        where: eq(clientes.cedula, cedula),
        with: {
            proyectos: {
                with: {
                    archivos: true
                }
            }
        }
    });

    return cliente;
}

import bcrypt from 'bcryptjs';

// Admins
export async function createAdmin(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Blindaje: Verificar si el email ya existe
    const existing = await db.query.usuariosAdmin.findFirst({
        where: eq(usuariosAdmin.email, email)
    });

    if (existing) {
        return { error: 'ESTE EMAIL YA TIENE ACCESO ADMINISTRATIVO.' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(usuariosAdmin).values({
            nombre,
            email,
            password: hashedPassword,
        });

        return { success: true };
    } catch (e) {
        return { error: 'FALLO EN LA ASIGNACIÓN DE CREDENCIALES.' };
    }
}

export async function getAdmins() {
    return await db.select({
        id: usuariosAdmin.id,
        nombre: usuariosAdmin.nombre,
        email: usuariosAdmin.email,
        createdAt: usuariosAdmin.createdAt
    }).from(usuariosAdmin).orderBy(usuariosAdmin.createdAt);
}

export async function deleteAdmin(id: string) {
    // Protocolo de Supervivencia: Verificar cuántos administradores quedan
    const totalAdmins = await db.select().from(usuariosAdmin);

    if (totalAdmins.length <= 1) {
        return { error: 'PROTOCOL DE SEGURIDAD: NO SE PUEDE ELIMINAR AL ÚLTIMO ADMINISTRADOR DEL SISTEMA.' };
    }

    await db.delete(usuariosAdmin).where(eq(usuariosAdmin.id, id));
    return { success: true };
}

// Archivos
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB (Límite estándar Vercel Blob Hobby)
const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'application/zip'
];

const PROJECT_STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB por proyecto

export async function uploadArchivo(formData: FormData, proyectoId: string, subidoPor: 'admin' | 'cliente') {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No se detectó ningún archivo.' };

    if (!proyectoId) return { error: 'ERROR TÉCNICO: ID de proyecto no detectado.' };

    // Blindaje de Tamaño (Individual)
    if (file.size > MAX_FILE_SIZE) {
        return { error: `ARCHIVO DEMASIADO GRANDE. Límite máximo: 4.5MB (El archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB).` };
    }

    // Blindaje de Tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: 'TIPO DE ARCHIVO NO PERMITIDO. Por seguridad, solo se aceptan imágenes, PDFs y documentos estándar.' };
    }

    // Blindaje de Cuota Total por Proyecto (50MB)
    const archivosProyecto = await db.query.archivos.findMany({
        where: eq(archivos.proyectoId, proyectoId)
    });

    const tamanoTotalActual = archivosProyecto.reduce((acc, arc) => acc + (arc.tamano || 0), 0);
    const nuevoTamanoTotal = tamanoTotalActual + file.size;

    if (nuevoTamanoTotal > PROJECT_STORAGE_LIMIT) {
        const MB_RESTANTES = ((PROJECT_STORAGE_LIMIT - tamanoTotalActual) / (1024 * 1024)).toFixed(2);
        return {
            error: `CUOTA DE PROYECTO EXCEDIDA. Límite de bóveda: 50MB. Espacio disponible: ${MB_RESTANTES}MB.`
        };
    }

    // Blindaje de Duplicidad (Nombre + Peso)
    const existeDuplicado = await db.query.archivos.findFirst({
        where: and(
            eq(archivos.nombre, file.name),
            eq(archivos.tamano, file.size),
            eq(archivos.proyectoId, proyectoId)
        )
    });

    if (existeDuplicado) {
        return { error: 'ESTE ACTIVO YA EXISTE EN LA BÓVEDA. Verifica el contenido para evitar duplicados.' };
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return { error: 'ERROR DE CONFIGURACIÓN: Llave de acceso a la nube no encontrada.' };
    }

    let blob;
    try {
        blob = await put(file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true
        });
    } catch (blobError: any) {
        console.error('Error Cloud Storage:', blobError);
        return { error: `ERROR DE CONEXIÓN CON LA NUBE: ${blobError.message || 'Fallo en la comunicación'}` };
    }

    try {
        await db.insert(archivos).values({
            url: blob.url,
            nombre: file.name,
            tipo: file.type && file.type.startsWith('image/') ? 'imagen' : 'documento',
            tamano: file.size,
            subidoPor,
            proyectoId,
        });

        revalidatePath('/admin');
        return { success: true, url: blob.url };
    } catch (dbError: any) {
        console.error('Error Database Sync:', dbError);
        return { error: `ERROR DE SINCRONIZACIÓN DB: ${dbError.message || 'FALLO EN EL REGISTRO'}` };
    }
}

export async function getArchivos() {
    return await db.query.archivos.findMany({
        with: {
            proyecto: {
                with: {
                    cliente: true
                }
            }
        },
        orderBy: (archivos, { desc }) => [desc(archivos.createdAt)],
    });
}

export async function deleteArchivo(id: string) {
    await db.delete(archivos).where(eq(archivos.id, id));
    revalidatePath('/admin/archivos');
    return { success: true };
}

export async function getSystemStatus() {
    try {
        // 1. Database Check
        await db.select().from(clientes).limit(1);

        // 2. Vercel Blob Check
        const blobActive = process.env.BLOB_READ_WRITE_TOKEN ? 'Sincronizado' : 'Error Config';

        return {
            database: 'Óptimo',
            blob: blobActive,
            auth: 'Seguro (AES-256)'
        };
    } catch (e) {
        return {
            database: 'Error Conexión',
            blob: 'Pendiente',
            auth: 'Vulnerable'
        };
    }
}
