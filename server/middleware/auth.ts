import { NextFunction, Response } from 'express';
import AuthorizedRequest from '../types/request';
import jwt, { Secret } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as Secret;

export const protect = async (
  req: AuthorizedRequest<any>,
  res: Response,
  next: NextFunction
) => {
  // If system doesn't support cookies, use authorization header
  const cookieToken = req.cookies.token;
  const requestToken = cookieToken || req.headers.authorization?.split(' ')[1];

  if (requestToken) {
    try {
      // Verify token and cast decoded payload to include id and role
      const decoded: any = jwt.verify(requestToken, secretKey) as { id: string; role: string };

      // get user id from decoded token and Assign the id and role to req.user
      req.user = { id: decoded.id, role: decoded.role };

      // pass user to next middleware
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ message: 'Unauthorized Access' });
    }
  } else {
    res.status(401).json({ message: 'Access denied, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthorizedRequest<any>, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }
    next();
  };
};
