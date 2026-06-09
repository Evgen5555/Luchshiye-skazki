"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRICING } from "@/lib/constants";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function PricingCards({
  stubPlan,
  showStubConfirm,
}: {
  stubPlan?: string | null;
  showStubConfirm?: boolean;
}) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleCheckout(plan: "monthly" | "single") {
    setLoadingPlan(plan);
    setMessage("");

    const response = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json();
    setLoadingPlan(null);

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/register");
        return;
      }
      setMessage(data.error || "Ошибка оплаты");
      return;
    }

    if (data.checkoutUrl) {
      router.push(data.checkoutUrl);
    }
  }

  async function confirmStubPayment() {
    if (!stubPlan) return;
    setLoadingPlan(stubPlan);

    const response = await fetch("/api/payment/confirm-stub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: stubPlan }),
    });

    const data = await response.json();
    setLoadingPlan(null);

    if (!response.ok) {
      setMessage(data.error || "Не удалось активировать тариф");
      return;
    }

    setMessage("Тариф активирован. Можно создавать новые сказки!");
    router.push("/create");
    router.refresh();
  }

  const plans = [PRICING.monthly, PRICING.single];

  return (
    <div className="space-y-6">
      {showStubConfirm && (
        <Card className="border-amber-200 bg-amber-50">
          <h2 className="text-lg font-bold text-amber-950">Тестовая оплата (заглушка)</h2>
          <p className="mt-2 text-sm text-amber-900">
            Реальная оплата будет подключена позже. Сейчас можно активировать тариф
            «{stubPlan === "monthly" ? "Подписка" : "Одна сказка"}» для проверки логики.
          </p>
          <Button className="mt-4" onClick={confirmStubPayment} disabled={!!loadingPlan}>
            {loadingPlan ? "Активируем..." : "Активировать тариф (тест)"}
          </Button>
        </Card>
      )}

      {message && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{plan.title}</h2>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price} ₽</span>
              <span className="ml-2 text-muted">/ {plan.period}</span>
            </div>

            <ul className="mb-8 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-auto"
              fullWidth
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? "Подождите..." : "Выбрать тариф"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
