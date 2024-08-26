import { IUserAuthenticationService } from "../../domain/interfaces/userAuthenticationService"

export class FirebaseAuthService implements IUserAuthenticationService {

    constructor() {
    }

    async getLoggedInUser(idToReflect: string): Promise<string> {
        return idToReflect;
    }

}