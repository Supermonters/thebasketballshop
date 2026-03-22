import type { NewsItem, Product } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function readJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function getProducts() {
  return readJson<{ products: Product[] }>(`${API_BASE}/products?lang=en`);
}

export async function getProduct(id: number) {
  return readJson<{ product: Product }>(`${API_BASE}/products/${id}?lang=en`);
}

export async function getNews() {
  return readJson<{ news: NewsItem[] }>(`${API_BASE}/news?lang=en`);
}

export async function signUp(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return readJson<{ message: string }>(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function signIn(payload: { email: string; password: string }) {
  return readJson<{ message: string; username: string; email: string }>(
    `${API_BASE}/auth/signin`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function signOut() {
  return readJson<{ message: string }>(`${API_BASE}/auth/signout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
}

export async function adminLogin(username: string, password: string) {
  const params = new URLSearchParams({ username, password }).toString();
  return readJson<{ message: string }>(`${API_BASE}/admin/checklogin?${params}`);
}

export async function addProduct(payload: Record<string, unknown>) {
  return readJson<{ message: string }>(`${API_BASE}/admin/addproduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function sendMail(mail: string) {
  const params = new URLSearchParams({ mail }).toString();
  return readJson<{ message: string }>(`${API_BASE}/mail?${params}`);
}
