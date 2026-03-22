import fetch from "node-fetch";

export async function firebaseRequest<T>(
  url: string,
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    const error = data.error as { message?: string } | undefined;
    throw new Error(error?.message || "Firebase request failed");
  }
  return data as T;
}

export function normalizeFirebaseError(message: string): string {
  const map: Record<string, string> = {
    EMAIL_EXISTS: "Email already exists",
    INVALID_EMAIL: "Email format is invalid",
    WEAK_PASSWORD: "Password must be at least 6 characters",
    EMAIL_NOT_FOUND: "Invalid email or password",
    INVALID_PASSWORD: "Invalid email or password",
    USER_DISABLED: "User account is disabled",
  };
  return map[message] || message;
}
