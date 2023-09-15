import { EnumUserStatus } from "../consts/enumUserStatus";
import { BaseDto, BaseDtoWithCommonFields } from "./base-dto";
import { PermissionDto, RoleDto, RoleLookUpDto } from "./role-dto";

//#region User detail page Dto.
export class UserDto extends BaseDtoWithCommonFields{
    username!:string;
    userType!:string;
    roleId!:RoleDto;
}
//#endregion


//#region User Profile and logged in user Dto 

/**
 * User Dto which include user permissions detail.
 */
export class UserWithPermissionsDto extends UserDto{
    permissionList!: Array<PermissionDto>;
}

/**
 * Dto for User profile page.
 */
export class UserProfileDto extends BaseDtoWithCommonFields{
    name!: string;
    surname!:string;
    wifeSurname!:string;
    village!:string;
    currResidency!:string;
    marriedStatus!:string;
    birthDate!:Date;
    weddingDate!:Date;
    education!:string;
    occupation!:string;
    mobileNumber!:string;
    countryCode!:string;
    email!:string;
}

/**
 * Dto for User profile Image
 */
export class UserProfileImageDto extends BaseDtoWithCommonFields{
    image!: string; 
}
//#endregion
