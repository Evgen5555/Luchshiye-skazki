import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import type { UserAccess } from "./types";

const SESSION_COOKIE = "skazki_session";
const SESSION_TTL = "7d";

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      trialUsed: true,
      subscriptionPlan: true,
      subscriptionEnds: true,
      createdAt: true,
    },
  });
}

export function getUserAccess(user: {
  trialUsed: boolean;
  subscriptionPlan: "NONE" | "MONTHLY" | "SINGLE_STORY";
  subscriptionEnds: Date | null;
}): UserAccess {
  const now = new Date();
  const hasActiveMonthly =
    user.subscriptionPlan === "MONTHLY" &&
    (!user.subscriptionEnds || user.subscriptionEnds > now);
  const hasSingleCredit = user.subscriptionPlan === "SINGLE_STORY";

  if (hasActiveMonthly) {
    return {
      canGenerate: true,
      reason: "subscribed",
      trialUsed: user.trialUsed,
      subscriptionPlan: user.subscriptionPlan,
    };
  }

  if (hasSingleCredit) {
    return {
      canGenerate: true,
      reason: "subscribed",
      trialUsed: user.trialUsed,
      subscriptionPlan: user.subscriptionPlan,
    };
  }

  if (!user.trialUsed) {
    return {
      canGenerate: true,
      reason: "trial_available",
      trialUsed: false,
      subscriptionPlan: "NONE",
    };
  }

  return {
    canGenerate: false,
    reason: "payment_required",
    trialUsed: true,
    subscriptionPlan: "NONE",
  };
}
