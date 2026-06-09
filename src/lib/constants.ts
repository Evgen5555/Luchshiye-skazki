import type { Atmosphere } from "./types";

export const ATMOSPHERES: {
  id: Atmosphere;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "bedtime",
    label: "Перед сном",
    emoji: "🌙",
    description: "Спокойная история с мягким финалом",
  },
  {
    id: "cozy",
    label: "Уютная",
    emoji: "🏠",
    description: "Тёплая домашняя атмосфера",
  },
  {
    id: "forest",
    label: "Лесная",
    emoji: "🌲",
    description: "Загадочный лес и добрые звери",
  },
  {
    id: "winter",
    label: "Зимняя",
    emoji: "❄️",
    description: "Снежная сказка и новогоднее чудо",
  },
  {
    id: "magical",
    label: "Волшебная",
    emoji: "✨",
    description: "Магия, чудеса и добрые феи",
  },
  {
    id: "adventure",
    label: "Приключение",
    emoji: "🧭",
    description: "Лёгкое приключение без страшилок",
  },
];

export const AGE_GROUPS = [
  { id: "2-3", label: "2–3 года" },
  { id: "4-5", label: "4–5 лет" },
  { id: "6-7", label: "6–7 лет" },
  { id: "8-10", label: "8–10 лет" },
] as const;

export const GENDERS = [
  { id: "female", label: "Девочка" },
  { id: "male", label: "Мальчик" },
  { id: "neutral", label: "Не важно" },
] as const;

export const IMAGE_STYLE_PROMPT =
  "Детская книжная иллюстрация, мягкая акварель, тёплые пастельные цвета, уютная атмосфера, добрые персонажи, без резких контрастов и пугающих деталей.";

export const PRICING = {
  monthly: {
    id: "monthly" as const,
    title: "Подписка",
    price: 499,
    currency: "RUB",
    period: "месяц",
    description: "Безлимитные сказки, PDF и сохранение историй",
    features: [
      "Неограниченное число сказок",
      "До 4 иллюстраций в каждой",
      "Скачивание PDF",
      "История ваших сказок",
    ],
  },
  single: {
    id: "single" as const,
    title: "Одна сказка",
    price: 149,
    currency: "RUB",
    period: "разово",
    description: "Идеально для подарка или особого случая",
    features: [
      "1 персональная сказка",
      "Обложка и 3 иллюстрации",
      "Скачивание PDF",
      "Ссылка для sharing",
    ],
  },
};
