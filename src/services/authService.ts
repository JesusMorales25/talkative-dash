// Authentication service for handling JWT-based login/logout
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";
const API_BASE_KEY = "api_url"; // Optional: override base URL via localStorage

type UserRole = "superadmin" | "admin" | "user";

interface TokenPayload {
  sub?: string;
  email?: string;
  role?: string | UserRole;
  id?: string | number;
  name?: string;
  exp?: number;
  [key: string]: unknown;
}

function getApiBaseUrl() {
  return localStorage.getItem(API_BASE_KEY) || "http://localhost:8080";
}

function getStorage(remember?: boolean) {
  return remember ? window.localStorage : window.sessionStorage;
}

export async function login(email: string, password: string, remember = false) {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Error de autenticación";
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    if (res.status === 401) message = "Credenciales inválidas";
    throw new Error(message);
  }

  const data = await res.json();
  const token: string | undefined = data?.token || data?.access_token;
  if (!token) throw new Error("Token no recibido desde el servidor");

  saveToken(token, remember);
  return token;
}

export function saveToken(token: string, remember = false) {
  // Clean any previous token
  removeToken();
  const storage = getStorage(remember);
  storage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  removeToken();
}

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

export function getCurrentUser(): { id: string; email: string; name: string; role: UserRole } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const p = decodeToken(token);
    const rawRole = (p.role as string) || "agente";
    const role: UserRole = mapBackendRole(rawRole);
    const id = (p.id ?? p.sub ?? "").toString();
    const email = (p.email ?? "").toString();
    const name = (p.name ?? email).toString();
    return { id, email, name, role };
  } catch {
    // Token inválido
    removeToken();
    return null;
  }
}

export function getUserRole(): string | null {
  return getCurrentUser()?.role ?? null;
}

function mapBackendRole(raw: string): "superadmin" | "admin" | "user" {
  const normalized = raw.replace(/^ROLE_/i, "").toLowerCase();
  if (normalized.includes("superadmin")) return "superadmin";
  if (normalized.includes("admin")) return "admin";
  if (
    normalized.includes("user") ||
    normalized.includes("agent") ||
    normalized.includes("agente") ||
    normalized.includes("supervisor")
  )
    return "user";
  return "user";
}
