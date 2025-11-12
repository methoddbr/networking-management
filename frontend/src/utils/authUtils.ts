/**
 * Utilitários para gerenciamento de autenticação
 * Token format: "role:user-id" (ex: "admin:456" ou "member:123")
 */

export type UserRole = "admin" | "member" | "guest";

export interface AuthToken {
  role: UserRole;
  userId: string;
}

const TOKEN_KEY = "auth_token";

/**
 * Salva o token no localStorage
 * @param role - Papel do usuário (admin, member, guest)
 * @param userId - ID do usuário
 */
export function setAuthToken(role: UserRole, userId: string): void {
  if (typeof window === "undefined") return;

  const token = `${role}:${userId}`;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Recupera o token do localStorage
 * @returns Token no formato "role:user-id" ou null
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Decodifica o token e retorna role e userId
 * @returns Objeto com role e userId ou null
 */
export function decodeAuthToken(): AuthToken | null {
  const token = getAuthToken();
  if (!token) return null;

  const [role, userId] = token.split(":");

  if (!role || !userId) return null;

  return {
    role: role as UserRole,
    userId,
  };
}

/**
 * Remove o token do localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Verifica se o usuário tem a role especificada
 * @param role - Role para verificar
 */
export function hasRole(role: UserRole): boolean {
  const decoded = decodeAuthToken();
  return decoded?.role === role;
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(): boolean {
  return hasRole("admin");
}

/**
 * Para desenvolvimento: define um token admin fake
 * REMOVER EM PRODUÇÃO!
 */
export function setDevAdminToken(): void {
  if (process.env.NODE_ENV === "development") {
    setAuthToken("admin", "dev-admin-123");
  }
}
