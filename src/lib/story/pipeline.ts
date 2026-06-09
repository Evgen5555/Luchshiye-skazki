import { getImageProvider } from "../ai/image-provider";
import { getTextProvider } from "../ai/text-provider";
import { prisma } from "../db";
import { consumeSingleStoryCredit } from "../payment/stub";
import type { GeneratedStoryContent } from "../types";

export type StoryInput = {
  userId: string;
  childName: string;
  ageGroup?: string;
  gender?: string;
  atmosphere: string;
  theme?: string;
  isTrial: boolean;
};

export async function runStoryPipeline(storyId: string, input: StoryInput) {
  try {
    await prisma.story.update({
      where: { id: storyId },
      data: { status: "GENERATING_TEXT" },
    });

    const textProvider = getTextProvider();
    const content = await textProvider.generateStory({
      childName: input.childName,
      ageGroup: input.ageGroup,
      gender: input.gender,
      atmosphere: input.atmosphere as StoryInput["atmosphere"],
      theme: input.theme,
    });

    await prisma.story.update({
      where: { id: storyId },
      data: {
        title: content.title,
        content: JSON.stringify(content.sections),
        status: "GENERATING_IMAGES",
      },
    });

    const imageProvider = getImageProvider();
    const images = await imageProvider.generateImages(content.imagePrompts);

    await prisma.$transaction([
      prisma.storyImage.createMany({
        data: images.map((image) => ({
          storyId,
          type: image.type,
          scene: image.scene ?? null,
          url: image.url,
          prompt: image.prompt,
        })),
      }),
      prisma.story.update({
        where: { id: storyId },
        data: { status: "COMPLETED" },
      }),
      ...(input.isTrial
        ? [
            prisma.user.update({
              where: { id: input.userId },
              data: { trialUsed: true },
            }),
          ]
        : []),
    ]);

    if (!input.isTrial) {
      const user = await prisma.user.findUnique({ where: { id: input.userId } });
      if (user?.subscriptionPlan === "SINGLE_STORY") {
        await consumeSingleStoryCredit(input.userId);
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка генерации";

    await prisma.story.update({
      where: { id: storyId },
      data: {
        status: "FAILED",
        error: message,
      },
    });
  }
}

export function parseStoryContent(raw: string | null): GeneratedStoryContent["sections"] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
