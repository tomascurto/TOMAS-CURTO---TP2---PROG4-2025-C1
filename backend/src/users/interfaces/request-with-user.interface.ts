import { Request } from 'express';
import { UserPayload } from '../../auth/interfaces/user-payload.interface';
export interface RequestWithUser extends Request {
  user: UserPayload;
}
