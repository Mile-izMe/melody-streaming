"use server";
import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true, // Avoid XSS
    path: "/", // Available on all routes
    maxAge: 900,
    sameSite: "lax", // CSRF protection
  });
}

export async function clearTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function setLocaleCookie(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "locale",
    value: locale,
    path: "/",
    maxAge: 31536000, // 1 year
  });
}
