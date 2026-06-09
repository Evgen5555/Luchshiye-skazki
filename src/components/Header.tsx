import Link from "next/link";
import { getCurrentUser, getUserAccess } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function Header() {
  const user = await getCurrentUser();
  const access = user ? getUserAccess(user) : null;

  return (
    <header className="border-b border-border/80 bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-foreground">
          ✨ Сказки
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-muted sm:inline">
                {user.name || user.email}
                {access?.reason === "trial_available" && " · пробная сказка"}
              </span>
              <Link
                href="/create"
                className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-accent-dark"
              >
                Создать
              </Link>
              <Link href="/pricing" className="text-muted hover:text-foreground">
                Тарифы
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-foreground">
                Войти
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-accent-dark"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
