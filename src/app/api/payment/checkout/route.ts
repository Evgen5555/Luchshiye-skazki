import { ApiError, errorResponse, jsonResponse, parseJsonBody } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { createCheckout } from "@/lib/payment/stub";
import { paymentPlanSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError("Требуется авторизация", 401);
    }

    const body = await parseJsonBody<unknown>(request);
    const parsed = paymentPlanSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError("Выберите тариф");
    }

    const checkout = await createCheckout(user.id, parsed.data.plan);

    return jsonResponse({
      ...checkout,
      message: "Оплата пока в режиме заглушки. Перейдите по ссылке для тестовой активации.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
