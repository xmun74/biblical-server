import IUser from "../models/user";

declare global {
  interface Error {
    status?: number;
  }
  namespace Express {
    interface User extends IUser {}
    namespace Multer {
      interface File {
        location?: string;
      }
    }
  }
}
