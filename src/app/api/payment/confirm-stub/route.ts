import { ApiError, errorResponse, jsonResponse, parseJsonBody } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { activateSubscription } from "@/lib/payment/stub";
import { paymentPlanSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError("Требуется авторизация", 401);
    }

    const body = await parseJsonBody<{ plan?: string }>(request);
    const parsed = paymentPlanSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError("Некорректный тариф");
    }

    await activateSubscription(user.id, parsed.data.plan);

    return jsonResponse({
      ok: true,
      message: "Тариф активирован (тестовая заглушка)",
      plan: parsed.data.plan,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
