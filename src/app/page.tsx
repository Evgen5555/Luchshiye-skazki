import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-10">
      <section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-dark">
          Персональные детские сказки
        </p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Волшебная история
          <br />
          с именем вашего ребёнка
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Создавайте уютные сказки на русском языке с милыми иллюстрациями.
          Выберите атмосферу, расскажите о чём история — и получите готовую
          книжку за пару минут.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={user ? "/create" : "/register"}>
            <Button>
              {user ? "Создать сказку" : "Начать бесплатно"}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary">Посмотреть тарифы</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "1. Регистрация",
            text: "Создайте аккаунт и получите одну пробную сказку бесплатно.",
          },
          {
            title: "2. Настройка",
            text: "Укажите имя ребёнка, атмосферу и тему — или доверьтесь нам.",
          },
          {
            title: "3. Результат",
            text: "Готовая сказка с иллюстрациями в уютном детском стиле.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
