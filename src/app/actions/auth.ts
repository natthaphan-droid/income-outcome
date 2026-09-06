"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDb } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

function getEnv() {
  try {
    return getCloudflareContext().env as any;
  } catch {
    return process.env;
  }
}

export async function registerUser(data: FormData) {
  const email = (data.get("email") as string)?.toLowerCase();
  const password = data.get("password") as string;
  const name = data.get("name") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const env = getEnv();
  const db = createDb(env);

  const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) {
    return { error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  await db.insert(users).values({
    id,
    email,
    passwordHash,
    name: name || "User",
  });

  return { success: true };
}

export async function forgotPassword(data: FormData) {
  const email = (data.get("email") as string)?.toLowerCase();
  if (!email) return { error: "Email is required" };

  const env = getEnv();
  const db = createDb(env);

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    // Return success anyway to prevent email enumeration
    return { success: true };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await db.insert(passwordResetTokens).values({
    id: crypto.randomUUID(),
    userId: user.id,
    token,
    expiresAt,
  });

  // Send email
  if (env.EMAIL_SERVER_HOST && env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: Number(env.EMAIL_SERVER_PORT || 587),
      auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    });

    const resetLink = `${env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: env.EMAIL_FROM || "noreply@justnavigate.com",
      to: email,
      subject: "Reset your JustNavigate password",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });
  } else {
    console.log("No email configuration found. Token for password reset: ", token);
  }

  return { success: true };
}

export async function resetPassword(data: FormData) {
  const token = data.get("token") as string;
  const password = data.get("password") as string;

  if (!token || !password) return { error: "Missing required fields" };

  const env = getEnv();
  const db = createDb(env);

  const resetToken = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).get();
  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return { error: "Invalid or expired token" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.update(users).set({ passwordHash }).where(eq(users.id, resetToken.userId));
  await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, resetToken.id));

  return { success: true };
}
