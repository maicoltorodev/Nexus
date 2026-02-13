import { pgTable, text, varchar, timestamp, integer, uuid, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clientes = pgTable("clientes", {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    cedula: varchar("cedula", { length: 20 }).notNull().unique(),
    email: text("email").notNull(),
    telefono: varchar("telefono", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proyectos = pgTable("proyectos", {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    plan: varchar("plan", { length: 50 }).notNull(), // Lanzamiento, Pro, Business
    estado: varchar("estado", { length: 50 }).default("pendiente").notNull(),
    progreso: integer("progreso").default(0).notNull(),
    fechaInicio: timestamp("fecha_inicio").defaultNow().notNull(),
    fechaEntrega: timestamp("fecha_entrega"),
    visibilidad: boolean("visibilidad").default(true).notNull(),
    link: varchar("link", { length: 255 }).default("Próximamente").notNull(),
    onboardingStep: integer("onboarding_step").default(0).notNull(),
    onboardingData: json("onboarding_data").$type<Record<string, any>>().default({}),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const archivos = pgTable("archivos", {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    nombre: text("nombre").notNull(),
    tipo: varchar("tipo", { length: 50 }), // imagen, documento, recurso
    tamano: integer("tamano"), // Tamaño en bytes
    subidoPor: varchar("subido_por", { length: 20 }).notNull(), // 'admin' | 'cliente'
    proyectoId: uuid("proyecto_id").references(() => proyectos.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relaciones
export const clientesRelations = relations(clientes, ({ many }) => ({
    proyectos: many(proyectos),
}));

export const proyectosRelations = relations(proyectos, ({ one, many }) => ({
    cliente: one(clientes, {
        fields: [proyectos.clienteId],
        references: [clientes.id],
    }),
    archivos: many(archivos),
}));

export const archivosCountRelations = relations(archivos, ({ one }) => ({
    proyecto: one(proyectos, {
        fields: [archivos.proyectoId],
        references: [proyectos.id],
    }),
}));

export const usuariosAdmin = pgTable("usuarios_admin", {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
