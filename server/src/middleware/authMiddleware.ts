import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../common/config";

export function authMiddleware(req: Request<any>, res: Response, next: NextFunction) {
  const cookie = req.cookies?.[config.JWT_COOKIE];

  if (!cookie) {
    res.status(401);
    res.redirect('/login');
    return;
  }

  try {
    const isValid = jwt.verify(cookie, config.JWT_SECRET);

    if (!isValid) {
      throw new Error();
    }
  } catch(e) {
    console.error(e);
    res.status(403);
    res.send('Forbidden');
    return;
  }

  console.log('>> cook', cookie)
  next();
}