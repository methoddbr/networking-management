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

// Mock: simula um usuário admin logado
export function mockAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Simula um token válido — depois será JWT real
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new AppError(401, "Missing authorization token"));
  }

  // Mock: qualquer token válido vira admin
  req.user = {
    id: "mock-user-id",
    role: "admin",
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
