import IUser from "../models/user";

declare global {
  interface Error {
    status?: number;
  }
  namespace Express {
    interface User extends IUser {}
  }
}

type FileNameCallback = (error: Error | null, filename: string) => void;
