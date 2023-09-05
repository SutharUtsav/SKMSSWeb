import { UserDto, UserProfileDto } from "./user-dto";

//#region Dto for Auth entity 
/**
 * Login Request Dto
 */
export class LoginDto {
    mobileNumber!:string;
    countryCode!:string;
}
/**
 * Login Response Dto
 */
export class AuthResult {
    user!:UserDto;
    userProfile!:UserProfileDto;
    strAuthToken!:string;
    
}
//#endregion