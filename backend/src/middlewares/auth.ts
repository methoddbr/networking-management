import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin" | "member" | "guest";
      };
    }
  }
}

// Mock: simula um usuário logado com role configurável
// Formato: Bearer <role>:<user-id> (ex: Bearer member:123 ou Bearer admin:456)
// Se não especificar role, assume admin por padrão (compatibilidade)
export function mockAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError(401, "Missing authorization token"));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Formato: role:user-id (ex: member:123, admin:456)
  const parts = token.split(":");
  let role: "admin" | "member" | "guest" = "admin";
  let userId = "mock-user-id";

  if (parts.length === 2) {
    const [rolePart, idPart] = parts;
    if (["admin", "member", "guest"].includes(rolePart)) {
      role = rolePart as "admin" | "member" | "guest";
      userId = idPart || userId;
    } else {
      // Se formato inválido, assume admin (compatibilidade)
      userId = token;
    }
  } else if (token) {
    // Token simples sem formato, assume admin (compatibilidade)
    userId = token;
  }

  req.user = {
    id: userId,
    role,
  };

  next();
}

// Middleware para verificar role
export function requireRole(role: "admin" | "member" | "guest") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (req.user.role !== role) {
      return next(new AppError(403, "Forbidden"));
    }

    next();
  };
}
