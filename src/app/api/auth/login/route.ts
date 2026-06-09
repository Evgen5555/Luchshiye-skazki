import { ApiError, errorResponse, jsonResponse, parseJsonBody } from "@/lib/api";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<unknown>(request);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Ошибка валидации");
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      throw new ApiError("Неверный email или пароль", 401);
    }

    await createSession(user.id);

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        trialUsed: user.trialUsed,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
