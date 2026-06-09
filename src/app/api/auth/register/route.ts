import { ApiError, errorResponse, jsonResponse, parseJsonBody } from "@/lib/api";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<unknown>(request);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Ошибка валидации");
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (existing) {
      throw new ApiError("Пользователь с таким email уже существует");
    }

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        trialUsed: true,
        subscriptionPlan: true,
      },
    });

    await createSession(user.id);

    return jsonResponse({
      user,
      message: "Регистрация успешна. Доступна одна пробная сказка.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
