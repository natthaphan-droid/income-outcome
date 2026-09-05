import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth((req) => {
  let env: any = {};
  try {
    env = getCloudflareContext().env;
  } catch (e) {
    env = process.env;
  }

  return {
    secret: env.AUTH_SECRET || process.env.AUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          // Get Cloudflare context
          let env;
          try {
            env = getCloudflareContext().env;
          } catch (e) {
            console.warn("Could not get Cloudflare env. Falling back to mock login for UI testing.");
          }
          
          if (!env?.DB) {
            // Mock login for local UI testing
            if (credentials.email === "test@test.com" && credentials.password === "password") {
              return { id: "mock-user-1", email: "test@test.com", name: "Test User" };
            }
            console.warn("DB not found and not using mock credentials.");
            return null;
          }

          const db = createDb(env as any);
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .get();

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
    trustHost: true,
  };
});
