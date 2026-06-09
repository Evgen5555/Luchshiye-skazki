"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ATMOSPHERES } from "@/lib/constants";
import type { StorySection } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

type StoryImage = {
  id: string;
  type: string;
  scene: number | null;
  url: string;
};

type StoryData = {
  id: string;
  status: string;
  title: string | null;
  childName: string;
  atmosphere: string;
  error: string | null;
  isTrial: boolean;
  sections: StorySection[];
  images: StoryImage[];
};

const statusLabels: Record<string, string> = {
  PENDING: "Готовим волшебство...",
  GENERATING_TEXT: "Пишем сказку...",
  GENERATING_IMAGES: "Рисуем иллюстрации...",
  COMPLETED: "Готово!",
  FAILED: "Ошибка",
};

export function StoryViewer({ storyId }: { storyId: string }) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let interval: ReturnType<typeof setInterval> | undefined;

    async function loadStory() {
      const response = await fetch(`/api/stories/${storyId}`);
      const data = await response.json();

      if (!active) return;

      if (!response.ok) {
        setError(data.error || "Не удалось загрузить сказку");
        return;
      }

      setStory(data);

      if (data.status !== "COMPLETED" && data.status !== "FAILED") {
        interval = setInterval(loadStory, 2000);
      }
    }

    loadStory();

    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [storyId]);

  if (error) {
    return (
      <Card>
        <p className="text-red-700">{error}</p>
        <Link href="/create" className="mt-4 inline-block text-accent-dark">
          Вернуться к созданию
        </Link>
      </Card>
    );
  }

  if (!story) {
    return (
      <Card className="text-center">
        <p className="text-lg">Загружаем сказку...</p>
      </Card>
    );
  }

  if (story.status === "FAILED") {
    return (
      <Card>
        <h1 className="text-2xl font-bold">Не удалось создать сказку</h1>
        <p className="mt-3 text-muted">{story.error}</p>
        <Link href="/create" className="mt-6 inline-block">
          <Button>Попробовать снова</Button>
        </Link>
      </Card>
    );
  }

  if (story.status !== "COMPLETED") {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-accent/30" />
        <h1 className="text-2xl font-bold">{statusLabels[story.status]}</h1>
        <p className="mt-3 text-muted">
          Это займёт около минуты. Страница обновится автоматически.
        </p>
      </Card>
    );
  }

  const atmosphereLabel =
    ATMOSPHERES.find((item) => item.id === story.atmosphere)?.label ??
    story.atmosphere;
  const cover = story.images.find((image) => image.type === "cover");
  const sceneImages = story.images.filter((image) => image.type === "scene");

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-[#fff0e4] px-3 py-1">{atmosphereLabel}</span>
          {story.isTrial && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
              Пробная сказка
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">{story.title}</h1>
        <p className="mt-2 text-muted">Для {story.childName}</p>

        {cover && (
          <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-3xl">
            <Image
              src={cover.url}
              alt="Обложка сказки"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </Card>

      {story.sections.map((section, index) => {
        const image = sceneImages[index];
        return (
          <Card key={section.title}>
            <h2 className="mb-4 text-xl font-bold">{section.title}</h2>
            <p className="whitespace-pre-line leading-8 text-foreground/90">
              {section.text}
            </p>
            {image && (
              <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-3xl">
                <Image
                  src={image.url}
                  alt={section.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </Card>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <Link href="/create">
          <Button>Создать новую сказку</Button>
        </Link>
        <Link href="/pricing">
          <Button variant="secondary">Тарифы</Button>
        </Link>
      </div>
    </div>
  );
}
