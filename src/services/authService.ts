import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token"; // 🔹 Usamos exactamente el mismo que en el login
const API_BASE_KEY = "api_url";

type UserRole = "superadmin" | "admin" | "user";

interface TokenPayload {
  sub?: string;
  email?: string;
  role?: string | UserRole;
  id?: string | number;
  name?: string;
  empresa?: string;     // posibles nombres que el backend use
  empresaId?: string;   // muchos tokens usan 'empresaId'
  company?: string;
  avatar?: string;
  exp?: number;
  [key: string]: unknown;
}

function getApiBaseUrl() {
  return localStorage.getItem(API_BASE_KEY) || "http://localhost:8081";
}

function getStorage(remember?: boolean) {
  return remember ? window.localStorage : window.localStorage; // 🔹 Forzado localStorage
}

export async function login(email: string, password: string, remember = false) {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }),
  });

  if (!res.ok) {
    let message = "Error de autenticación";
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {
      // Intentionally ignored: error parsing response JSON
    }
    if (res.status === 401) message = "Credenciales inválidas";
    throw new Error(message);
  }

  const data = await res.json();
  const token: string | undefined = data?.token || data?.access_token;
  if (!token) throw new Error("Token no recibido desde el servidor");

  saveToken(token, remember);

  // Retornamos usuario decodificado
  const user = getCurrentUser();
  return { token, user };
}

export function saveToken(token: string, remember = false) {
  removeToken();
  const storage = getStorage(remember);
  storage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || null; // 🔹 Sólo localStorage para evitar desincronizar
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    ...(init?.headers || {}),
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    logout();
    window.location.href = "/login";
  }

  return response;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  try {
    // Elimina token
    removeToken();

    // Limpia API base si quieres forzar a reconfigurar
    localStorage.removeItem("api_url");

    // Limpia cualquier dato relacionado a sesión
    localStorage.removeItem("user_preferences");
    sessionStorage.clear();

    // Si tienes un AuthContext, también limpia su estado
    if (typeof window !== "undefined") {
      // Forzamos un reload para resetear estados en memoria
      window.location.href = "/login";
    }
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
}


export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

export function getCurrentUser(): {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
} | null {
  const token = getToken();
  if (!token) return null;

  try {
    // decodifica el payload del token (usa jwtDecode)
    const p = decodeToken(token);

    // ROLE_... -> normalize y mapear a UserRole
    const rawRole = (p.role as string) ?? "user";
    const role: UserRole = mapBackendRole(rawRole);

    // id/email/name con fallbacks razonables
    const id = (p.id ?? p.sub ?? "").toString();
    const email = (p.email ?? p.sub ?? "").toString();
    const name = (p.name ?? email).toString();

    // leer empresa: chequeamos varios nombres que podría usar el backend
    const companyRaw = p.empresaId ?? p.empresa ?? p.company ?? "";
    const company = companyRaw ? companyRaw.toString() : undefined;

    return { id, email, name, role, company };
  } catch (err) {
    // token inválido -> limpiar e indicar no-autenticado
    removeToken();
    return null;
  }
}


function mapBackendRole(raw: string): UserRole {
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
