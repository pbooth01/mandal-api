export interface IUserAuthenticationService {
    getLoggedInUser(idToReflect: string): Promise<string>
}