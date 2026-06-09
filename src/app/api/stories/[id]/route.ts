import { ApiError, errorResponse, jsonResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseStoryContent } from "@/lib/story/pipeline";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError("Требуется авторизация", 401);
    }

    const { id } = await params;
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ type: "asc" }, { scene: "asc" }],
        },
      },
    });

    if (!story || story.userId !== user.id) {
      throw new ApiError("Сказка не найдена", 404);
    }

    return jsonResponse({
      id: story.id,
      status: story.status,
      title: story.title,
      childName: story.childName,
      atmosphere: story.atmosphere,
      theme: story.theme,
      error: story.error,
      isTrial: story.isTrial,
      sections: parseStoryContent(story.content),
      images: story.images,
      createdAt: story.createdAt,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
