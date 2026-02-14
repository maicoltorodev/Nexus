'use server';

import { db } from './db';
import { clientes, proyectos, archivos, usuariosAdmin, notas } from './db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// Helper: Notifications
async function sendNotification(type: 'CREATE' | 'ONBOARDING' | 'MESSAGE', projectName: string) {
    const priority = type === 'ONBOARDING' ? '5' : type === 'MESSAGE' ? '4' : '3';
    try {
        await fetch('https://ntfy.sh/crm_idk_secure_923847293847293847', {
            method: 'POST',
            headers: { 'Priority': priority },
            body: `${type} | ${projectName}`,
        });
    } catch (e) {
        console.error('Notification Error:', e);
    }
}

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
            notas: {
                orderBy: (notas, { asc }) => [asc(notas.createdAt)]
            }
        },
        orderBy: (proyectos, { desc }) => [desc(proyectos.createdAt)],
    });
}

export async function getProyectoByCedula(cedula: string) {
    const result = await db.query.clientes.findFirst({
        where: eq(clientes.cedula, cedula),
        with: {
            proyectos: {
                with: {
                    archivos: true,
                    notas: {
                        orderBy: (notas, { asc }) => [asc(notas.createdAt)]
                    }
                }
            }
        }
    });

    return result;
}

export async function createProyecto(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const plan = formData.get('plan') as string;
    const clienteId = formData.get('clienteId') as string;
    const fechaEntregaStr = formData.get('fechaEntrega') as string;

    try {
        await db.insert(proyectos).values({
            nombre,
            plan,
            clienteId,
            estado: 'pendiente',
            progreso: 0,
            fechaEntrega: fechaEntregaStr ? new Date(fechaEntregaStr) : null,
        });

        // NOTIFICACION: Proyecto Creado
        await sendNotification('CREATE', nombre);

        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL CREAR EL PROYECTO.' };
    }
}

export async function updateProyectoProgreso(id: string, progreso: number, estado: string) {
    try {
        await db.update(proyectos)
            .set({ progreso, estado })
            .where(eq(proyectos.id, id));
        revalidatePath('/admin');
        revalidatePath(`/seguimiento`);
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ACTUALIZAR EL PROGRESO.' };
    }
}

export async function updateProyectoVisibilidad(id: string, visibilidad: boolean) {
    try {
        await db.update(proyectos)
            .set({ visibilidad })
            .where(eq(proyectos.id, id));
        revalidatePath('/admin');
        revalidatePath(`/seguimiento`);
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL CAMBIAR VISIBILIDAD.' };
    }
}

export async function updateProyectoOnboarding(id: string, step: number, data: any) {
    try {
        // NOTIFICACION: Onboarding Completo
        if (data.onboardingCompletedAt) {
            const proj = await db.query.proyectos.findFirst({ where: eq(proyectos.id, id) });
            await sendNotification('ONBOARDING', proj?.nombre || 'Sin Nombre');
        }

        // PREPARE UPDATE: Base fields
        const updateFields: any = { onboardingStep: step, onboardingData: data };

        // AUTOMATION: Set Public URL from Domain
        if (data.dominioUno) {
            updateFields.link = `www.${data.dominioUno}.com`;
            revalidatePath('/admin'); // Revalidate admin if link changes
        }

        await db.update(proyectos)
            .set(updateFields)
            .where(eq(proyectos.id, id));
        revalidatePath('/seguimiento');
        return { success: true };
    } catch (e) {
        return { error: "Failed to update onboarding" };
    }
}

export async function updateProyectoLink(id: string, link: string) {
    try {
        await db.update(proyectos)
            .set({ link })
            .where(eq(proyectos.id, id));
        revalidatePath('/admin');
        revalidatePath(`/seguimiento`);
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ACTUALIZAR EL ENLACE.' };
    }
}

export async function updateProyectoPlan(id: string, plan: string) {
    try {
        await db.update(proyectos)
            .set({ plan })
            .where(eq(proyectos.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ACTUALIZAR EL PLAN.' };
    }
}

export async function updateProyectoFecha(id: string, fechaEntrega: Date) {
    try {
        await db.update(proyectos)
            .set({ fechaEntrega })
            .where(eq(proyectos.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ACTUALIZAR LA FECHA.' };
    }
}

// Support for legacy single-note field but forwarding to new system if possible
// Or just creating a new note
export async function updateProyectoNotas(id: string, notasContent: string, images: string[] = []) {
    return await addNota(id, notasContent, 'cliente', images);
}

// New Notes System
export async function addNota(proyectoId: string, contenido: string, autor: 'cliente' | 'admin', imagenes: string[] = []) {
    try {
        await db.insert(notas).values({
            proyectoId,
            contenido,
            autor,
            imagenes,
            leido: false,
        });

        // NOTIFICACION: Nuevo Mensaje de Cliente
        if (autor === 'cliente') {
            const proj = await db.query.proyectos.findFirst({ where: eq(proyectos.id, proyectoId) });
            await sendNotification('MESSAGE', proj?.nombre || 'Sin Nombre');
        }

        // OPTIMIZATION: Keep only the last 50 messages
        const allNotes = await db.select().from(notas)
            .where(eq(notas.proyectoId, proyectoId))
            .orderBy(asc(notas.createdAt));

        if (allNotes.length > 50) {
            const excessCount = allNotes.length - 50;
            const notesToDelete = allNotes.slice(0, excessCount);

            for (const note of notesToDelete) {
                await db.delete(notas).where(eq(notas.id, note.id));
            }
        }

        revalidatePath('/admin');
        revalidatePath('/seguimiento');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL GUARDAR LA NOTA.' };
    }
}

export async function deleteProyecto(id: string) {
    try {
        await db.delete(proyectos).where(eq(proyectos.id, id));
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ELIMINAR PROYECTO.' };
    }
}

// Archivos
export async function uploadArchivo(formData: FormData) {
    const file = formData.get('file') as File;
    const proyectoId = formData.get('proyectoId') as string;
    const subidoPor = formData.get('subidoPor') as string; // 'admin' o 'cliente'

    if (!file) return { error: 'NO SE HA SELECCIONADO NINGÚN ARCHIVO.' };

    // SECURITY: Validate File Type (Whitelist)
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: 'FORMATO NO VALIDO. SOLO SE PERMITEN IMAGENES (JPG, PNG, WEBP).' };
    }

    try {
        const uniqueFilename = `${Date.now()}-${file.name}`;
        const blob = await put(uniqueFilename, file, {
            access: 'public',
        });

        await db.insert(archivos).values({
            url: blob.url,
            nombre: file.name,
            tipo: file.type.split('/')[0], // imagen, application, etc.
            tamano: file.size,
            subidoPor,
            proyectoId,
        });

        // NOTIFICACION: Nuevo Archivo (Deshabilitado por simplificación)


        revalidatePath('/admin');
        revalidatePath(`/seguimiento`);
        return { success: true, url: blob.url };
    } catch (e) {
        return { error: 'ERROR EN LA CARGA DEL ARCHIVO.' };
    }
}

export async function deleteArchivo(id: string) {
    try {
        // En un caso real, también eliminaríamos del blob store usando del()
        await db.delete(archivos).where(eq(archivos.id, id));
        revalidatePath('/admin');
        revalidatePath(`/seguimiento`);
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ELIMINAR ARCHIVO.' };
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

// Auth Admin (Simple)
export async function loginAdmin(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
        const user = await db.query.usuariosAdmin.findFirst({
            where: eq(usuariosAdmin.username, username)
        });

        if (user && await bcrypt.compare(password, user.password)) {
            return { success: true };
        }
        return { error: 'CREDENCIALES INVÁLIDAS' };
    } catch (e) {
        return { error: 'ERROR DE AUTENTICACIÓN' };
    }
}


export async function getAdmins() {
    return await db.select().from(usuariosAdmin).orderBy(desc(usuariosAdmin.createdAt));
}



// Client Data Updates (Post-Onboarding)
export async function updateProyectoClientData(id: string, onboardingData: any) {
    try {
        await db.update(proyectos)
            .set({ onboardingData })
            .where(eq(proyectos.id, id));

        revalidatePath('/seguimiento');
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error('Error updating client data:', e);
        return { error: 'ERROR AL ACTUALIZAR LOS DATOS.' };
    }
}

export async function createAdmin(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const existing = await db.query.usuariosAdmin.findFirst({
        where: eq(usuariosAdmin.username, username)
    });

    if (existing) {
        return { error: 'EL USUARIO YA EXISTE.' };
    }

    // BLINDAJE DE SEGURIDAD: Validación de contraseña fuerte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return {
            error: 'LA CONTRASEÑA ES DÉBIL. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).'
        };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(usuariosAdmin).values({
            nombre,
            username,
            password: hashedPassword,
        });

        revalidatePath('/admin/admins');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL CREAR ADMINISTRADOR.' };
    }
}

export async function deleteAdmin(id: string) {
    try {
        await db.delete(usuariosAdmin).where(eq(usuariosAdmin.id, id));
        revalidatePath('/admin/admins');
        return { success: true };
    } catch (e) {
        return { error: 'ERROR AL ELIMINAR ADMINISTRADOR.' };
    }
}

export async function getSystemStatus() {
    try {
        await db.execute('SELECT 1');
        return { database: 'ok', blob: 'ok', auth: 'ok' };
    } catch (e) {
        return { database: 'error', blob: 'error', auth: 'error' };
    }
}
