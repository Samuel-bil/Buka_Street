import { Request } from 'express';

type AuthorizedRequest<T> = Request<never, never, T> & {
   user?: {
    id: string;
    role: string;
  };
};

export default AuthorizedRequest;

