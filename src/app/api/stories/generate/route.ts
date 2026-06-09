import { ApiError, errorResponse, jsonResponse, parseJsonBody } from "@/lib/api";
import { getCurrentUser, getUserAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runStoryPipeline } from "@/lib/story/pipeline";
import { createStorySchema, isThemeSafe } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError("Требуется регистрация", 401);
    }

    const access = getUserAccess(user);
    if (!access.canGenerate) {
      throw new ApiError("Требуется оплата", 402);
    }

    const body = await parseJsonBody<unknown>(request);
    const parsed = createStorySchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Ошибка валидации");
    }

    if (!isThemeSafe(parsed.data.theme)) {
      throw new ApiError("Пожалуйста, измените описание сказки");
    }

    const isTrial = !user.trialUsed && access.reason === "trial_available";

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        childName: parsed.data.childName,
        ageGroup: parsed.data.ageGroup,
        gender: parsed.data.gender,
        atmosphere: parsed.data.atmosphere,
        theme: parsed.data.theme,
        isTrial,
        status: "PENDING",
      },
    });

    void runStoryPipeline(story.id, {
      userId: user.id,
      childName: parsed.data.childName,
      ageGroup: parsed.data.ageGroup,
      gender: parsed.data.gender,
      atmosphere: parsed.data.atmosphere,
      theme: parsed.data.theme,
      isTrial,
    });

    return jsonResponse({
      id: story.id,
      status: story.status,
      isTrial,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
