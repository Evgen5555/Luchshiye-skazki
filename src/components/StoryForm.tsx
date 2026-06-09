"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AGE_GROUPS, ATMOSPHERES, GENDERS } from "@/lib/constants";
import type { Atmosphere, UserAccess } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

export function StoryForm({ access }: { access: UserAccess }) {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [ageGroup, setAgeGroup] = useState("4-5");
  const [gender, setGender] = useState("neutral");
  const [atmosphere, setAtmosphere] = useState<Atmosphere>("bedtime");
  const [theme, setTheme] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!access.canGenerate) {
      router.push("/pricing");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/stories/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childName,
        ageGroup,
        gender,
        atmosphere,
        theme: theme || undefined,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.status === 402) {
      router.push("/pricing");
      return;
    }

    if (!response.ok) {
      setError(data.error || "Не удалось создать сказку");
      return;
    }

    router.push(`/story/${data.id}`);
  }

  return (
    <Card>
      {!access.canGenerate && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Пробная сказка уже использована. Выберите тариф, чтобы продолжить.
        </div>
      )}

      {access.reason === "trial_available" && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Вам доступна одна бесплатная пробная сказка.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Имя ребёнка</label>
          <Input
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Например, Маша"
            required
            disabled={!access.canGenerate}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Возраст</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3"
              disabled={!access.canGenerate}
            >
              {AGE_GROUPS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Пол</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3"
              disabled={!access.canGenerate}
            >
              {GENDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">Атмосфера</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {ATMOSPHERES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAtmosphere(item.id)}
                disabled={!access.canGenerate}
                className={`rounded-2xl border p-4 text-left transition ${
                  atmosphere === item.id
                    ? "border-accent bg-[#fff3ea]"
                    : "border-border bg-white hover:bg-[#fffaf5]"
                }`}
              >
                <div className="text-lg font-semibold">
                  {item.emoji} {item.label}
                </div>
                <div className="mt-1 text-sm text-muted">{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            О чём сказка (необязательно)
          </label>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Например, про зайчонка, который боялся темноты"
            rows={4}
            maxLength={300}
            disabled={!access.canGenerate}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-accent"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <Button type="submit" fullWidth disabled={loading || !access.canGenerate}>
          {loading ? "Создаём сказку..." : "Создать сказку ✨"}
        </Button>

        {!access.canGenerate && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => router.push("/pricing")}
          >
            Перейти к оплате
          </Button>
        )}
      </form>
    </Card>
  );
}
