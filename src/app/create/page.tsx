import { redirect } from "next/navigation";
import { StoryForm } from "@/components/StoryForm";
import { getCurrentUser, getUserAccess } from "@/lib/auth";

export default async function CreatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/register");

  const access = getUserAccess(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Создать сказку</h1>
        <p className="mt-2 text-muted">
          Заполните параметры — мы напишем историю и нарисуем иллюстрации.
        </p>
      </div>

      <StoryForm access={access} />
    </div>
  );
}
