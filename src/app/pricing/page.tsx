import { PricingCards } from "@/components/PricingCards";

type Props = {
  searchParams: Promise<{
    payment?: string;
    plan?: string;
  }>;
};

export default async function PricingPage({ searchParams }: Props) {
  const params = await searchParams;
  const showStubConfirm = params.payment === "stub";
  const stubPlan = params.plan ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Тарифы</h1>
        <p className="mt-2 max-w-2xl text-muted">
          После регистрации доступна одна пробная сказка. Дальше — подписка или
          разовая покупка. Оплата подключается позже, сейчас работает тестовая
          заглушка.
        </p>
      </div>

      <PricingCards stubPlan={stubPlan} showStubConfirm={showStubConfirm} />
    </div>
  );
}
