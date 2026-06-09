import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
  name: z.string().min(2, "Имя слишком короткое").max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const createStorySchema = z.object({
  childName: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(30, "Имя слишком длинное"),
  ageGroup: z.enum(["2-3", "4-5", "6-7", "8-10"]).optional(),
  gender: z.enum(["female", "male", "neutral"]).optional(),
  atmosphere: z.enum([
    "bedtime",
    "cozy",
    "forest",
    "winter",
    "magical",
    "adventure",
  ]),
  theme: z.string().max(300, "Описание слишком длинное").optional(),
});

export const paymentPlanSchema = z.object({
  plan: z.enum(["monthly", "single"]),
});

const bannedPatterns = [
  /сука/i,
  /бля/i,
  /хуй/i,
  /пизд/i,
  /насили/i,
  /убий/i,
  /секс/i,
  /порно/i,
];

export function isThemeSafe(theme?: string): boolean {
  if (!theme) return true;
  return !bannedPatterns.some((pattern) => pattern.test(theme));
}
