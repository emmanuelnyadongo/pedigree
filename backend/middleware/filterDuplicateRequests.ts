import { Request, Response, NextFunction } from "express";

export function filterDuplicateRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method == "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
  } else {
    next();
  }
}
