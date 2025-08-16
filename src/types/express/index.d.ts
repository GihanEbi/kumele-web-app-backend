import { Server } from 'socket.io';

// This merges our custom property with the existing Express Request interface
declare global {
  namespace Express {
    export interface Request {
      io: Server;
      // You can also add your user property from the auth middleware here
      // user?: { id: string; username: string; /* other user properties */ };
    }
  }
}