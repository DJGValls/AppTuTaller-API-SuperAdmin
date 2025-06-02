import { user } from "../../../src/types/UserTypes";

declare global {
    namespace Express {
        interface Request {
            currentUser: user;
        }
    }
}
