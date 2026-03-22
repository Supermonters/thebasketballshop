export type CartItem = {
  id: number;
  name: string;
  option: string;
  price: string;
  cartpic: string;
  quantity: number;
};

const CART_KEY = "cart_v2";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.id === item.id && entry.option === item.option);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

export function removeFromCart(id: number, option: string) {
  const cart = getCart().filter((entry) => !(entry.id === id && entry.option === option));
  saveCart(cart);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function parsePrice(price: string) {
  const digits = price.replace(/[^\d]/g, "");
  return Number(digits || "0");
}
