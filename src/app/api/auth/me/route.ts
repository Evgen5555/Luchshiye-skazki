import { errorResponse, jsonResponse } from "@/lib/api";
import { getCurrentUser, getUserAccess } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return jsonResponse({ user: null, access: null });
    }

    return jsonResponse({
      user,
      access: getUserAccess(user),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
