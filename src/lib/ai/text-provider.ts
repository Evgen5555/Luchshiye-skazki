import type { Atmosphere, GeneratedStoryContent } from "../types";

export type StoryGenerationInput = {
  childName: string;
  ageGroup?: string;
  gender?: string;
  atmosphere: Atmosphere;
  theme?: string;
};

export interface TextGenerationProvider {
  generateStory(input: StoryGenerationInput): Promise<GeneratedStoryContent>;
}

const atmosphereTitles: Record<Atmosphere, string> = {
  bedtime: "лунный сон",
  cozy: "тёплый дом",
  forest: "лесная тропинка",
  winter: "снежное чудо",
  magical: "волшебный свет",
  adventure: "маленькое приключение",
};

export class StubTextProvider implements TextGenerationProvider {
  async generateStory(
    input: StoryGenerationInput,
  ): Promise<GeneratedStoryContent> {
    await delay(1200);

    const themePart = input.theme
      ? ` История рассказывает ${input.theme.toLowerCase()}.`
      : "";
    const title = `Сказка про ${input.childName} и ${atmosphereTitles[input.atmosphere]}`;

    return {
      title,
      sections: [
        {
          title: "Глава 1. Начало",
          text: `Жил-был ${input.childName} — добрый и любознательный ребёнок.${themePart} Однажды вечером ${input.childName} заметил, что вокруг стало особенно уютно, словно сама сказка тихо постучалась в дверь.`,
        },
        {
          title: "Глава 2. Путь",
          text: `${input.childName} отправился в путь и встретил маленького друга, который нуждался в помощи. Вместе они шли вперёд, смеялись, делились тёплыми словами и находили красоту в простых вещах: в мягком свете, в добром взгляде, в тихом шорохе листьев.`,
        },
        {
          title: "Глава 3. Счастливый финал",
          text: `В конце дня ${input.childName} понял главное: самое важное волшебство — это доброта и забота. Дома его ждали близкие, а сердце было наполнено спокойствием и радостью. И с тех пор каждый вечер ${input.childName} засыпал с улыбкой, зная, что завтра ждёт новое маленькое чудо.`,
        },
      ],
      imagePrompts: [
        {
          scene: 0,
          type: "cover",
          prompt: `Обложка детской книги: ${input.childName} в атмосфере ${input.atmosphere}, уютная сказочная сцена`,
        },
        {
          scene: 1,
          type: "scene",
          prompt: `${input.childName} начинает сказочное путешествие, атмосфера ${input.atmosphere}`,
        },
        {
          scene: 2,
          type: "scene",
          prompt: `${input.childName} встречает доброго друга в сказочном мире`,
        },
        {
          scene: 3,
          type: "scene",
          prompt: `${input.childName} возвращается домой, счастливый финал, тёплый свет`,
        },
      ],
    };
  }
}

export class ChatGptTextProvider implements TextGenerationProvider {
  async generateStory(
    _input: StoryGenerationInput,
  ): Promise<GeneratedStoryContent> {
    throw new Error(
      "ChatGPT text provider is not configured yet. Set OPENAI_API_KEY and implement integration.",
    );
  }
}

export function getTextProvider(): TextGenerationProvider {
  if (process.env.OPENAI_API_KEY) {
    return new ChatGptTextProvider();
  }
  return new StubTextProvider();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
