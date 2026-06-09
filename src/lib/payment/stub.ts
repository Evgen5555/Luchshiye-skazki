import { prisma } from "../db";

export type PaymentPlan = "monthly" | "single";

export type CheckoutResult = {
  checkoutUrl: string;
  paymentId: string;
  stub: true;
};

export async function createCheckout(
  userId: string,
  plan: PaymentPlan,
): Promise<CheckoutResult> {
  const paymentId = `stub_${plan}_${Date.now()}`;

  return {
    checkoutUrl: `/pricing?payment=stub&plan=${plan}&paymentId=${paymentId}&userId=${userId}`,
    paymentId,
    stub: true,
  };
}

export async function activateSubscription(
  userId: string,
  plan: PaymentPlan,
): Promise<void> {
  if (plan === "monthly") {
    const ends = new Date();
    ends.setMonth(ends.getMonth() + 1);

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: "MONTHLY",
        subscriptionEnds: ends,
      },
    });
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: "SINGLE_STORY",
      subscriptionEnds: null,
    },
  });
}

export async function consumeSingleStoryCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.subscriptionPlan !== "SINGLE_STORY") return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: "NONE",
    },
  });
}
