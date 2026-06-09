import { errorResponse, jsonResponse } from "@/lib/api";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
