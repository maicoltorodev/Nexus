import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db";
import { usuariosAdmin } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.query.usuariosAdmin.findFirst({
                    where: eq(usuariosAdmin.email, credentials.email as string),
                });

                if (!user) return null;

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordCorrect) return null;

                return {
                    id: user.id,
                    name: user.nombre,
                    email: user.email,
                };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isPublicAdminPage = nextUrl.pathname === "/admin/login";

            if (isOnAdmin) {
                if (isLoggedIn || isPublicAdminPage) return true;
                return false; // Redirect to login
            }
            return true;
        },
    },
});
