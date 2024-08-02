import { Request, Response, NextFunction } from "express";
import { SessionManager } from "../sessions/sessions";

export function createVerifyAuth(sessions: SessionManager) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Check if the request has the Authorization header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get the supplier ID from the session object
    const supplierId = sessions.getSession(token);

    // Check if the supplier ID is defined
    if (!supplierId) {
      return res.status(440).json({ message: "Unauthorized" });
    }

    res.locals.supplierId = supplierId;
    next();
  };
}
