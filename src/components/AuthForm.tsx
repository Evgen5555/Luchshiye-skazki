"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const body =
      mode === "register" ? { email, password, name: name || undefined } : { email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Что-то пошло не так");
      return;
    }

    router.push(mode === "register" ? "/create" : "/create");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">
        {mode === "register" ? "Регистрация" : "Вход"}
      </h1>
      <p className="mb-6 text-sm text-muted">
        {mode === "register"
          ? "После регистрации вам доступна одна пробная сказка."
          : "Войдите, чтобы создавать сказки для своих детей."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-2 block text-sm font-medium">Ваше имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Пароль</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading
            ? "Подождите..."
            : mode === "register"
              ? "Зарегистрироваться"
              : "Войти"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {mode === "register" ? (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-accent-dark">
              Войти
            </Link>
          </>
        ) : (
          <>
            Нет аккаунта?{" "}
            <Link href="/register" className="font-semibold text-accent-dark">
              Зарегистрироваться
            </Link>
          </>
        )}
      </p>
    </Card>
  );
}
