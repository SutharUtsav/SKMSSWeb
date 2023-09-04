//this file includes all functions that checks validation for incoming req in api

import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumPermission, EnumPermissionName } from "../consts/enumPermission";
import { EnumPermissionFor, EnumPermissionForName } from "../consts/enumPermissionFor";
import { EnumRoleType, EnumRoleTypeName } from "../consts/enumRoleType";
import { EnumUserStatus } from "../consts/enumUserStatus";
import { ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { UserDto, UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { areAllFieldsFilled } from "./heper";


//#region Regex validations

export const regexMobile =  /^[7-9]\d{9}$/;        
export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//#endregion

/**
 * Validation Check function for User-profile Entity
 * @param body 
 * @returns 
 */
export const validateUserProfile = (body: UserProfileDto): UserProfileDto | ErrorDto | undefined => {
    let userDto: UserProfileDto = new UserProfileDto();


    console.log(areAllFieldsFilled(body))
    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        if (!body.name || !body.surname || !body.wifeSurname || !body.city || !body.currResidency || !body.marriedStatus || !body.birthDate || !body.weddingDate || !body.education || !body.occupation || !body.countryCode || !body.mobileNumber || !body.email) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        if (!regexMobile.test(body.mobileNumber) || !regexEmail.test(body.email)) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        if (new Date(body.birthDate).toString() === "Invalid Date" || new Date(body.weddingDate).toString() === "Invalid Date") {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        //set fields of UserDto
        userDto.name = body.name;
        userDto.surname = body.surname;
        userDto.wifeSurname = body.wifeSurname;
        userDto.city = body.city;
        userDto.currResidency = body.currResidency;
        userDto.marriedStatus = body.marriedStatus;
        userDto.birthDate = new Date(body.birthDate);
        userDto.weddingDate = new Date(body.weddingDate);
        userDto.education = body.education;
        userDto.occupation = body.occupation;
        userDto.mobileNumber = body.mobileNumber;
        userDto.countryCode = body.countryCode;
        userDto.email = body.email;
    }
    return userDto;
}

/**
 * Validation Check function for User Entity
 * @param body 
 * @returns 
 */
export const validateUser = (body: UserDto): UserDto | ErrorDto | undefined => {
    let userDto: UserDto = new UserDto();



    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        //check all required fields

        if (!body.username || !body.roleId) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        if (EnumUserStatus[body.userType as keyof typeof EnumUserStatus] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }


        //set fields of UserDto
        userDto.username = body.username;
        userDto.userType = body.userType;
        userDto.roleId = body.roleId;
    }

    return userDto;
}


/**
 * Validation Check function for Role Entity 
 * @param body 
 * @returns 
 */
export const validateRole = (body: RoleDto): RoleDto | ErrorDto | undefined => {
    let roleDto: RoleDto = new RoleDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {

        //set fields of RoleDto
        roleDto.name = body.name;
        roleDto.description = body.description;
        if (body.rolePermissionIds)
            roleDto.rolePermissionIds = body.rolePermissionIds;
        //set roleType Field
        if (EnumRoleType[body.roleType as keyof typeof EnumRoleType] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            roleDto.roleType = EnumRoleTypeName[EnumRoleType[body.roleType as keyof typeof EnumRoleType]];
        }
    }

    return roleDto;
}

/**
 * Validation Check function for Role Permission Entity 
 * @param body 
 * @returns 
 */
export const validateRolePermission = (body: PermissionDto): PermissionDto | ErrorDto | undefined => {
    let permissionDto: PermissionDto = new PermissionDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        //set permissionFor field
        if (EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            permissionDto.permissionFor = EnumPermissionForName[EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor]];
        }

        //set permissions field
        if (EnumPermission[body.permissions as keyof typeof EnumPermission] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            permissionDto.permissions = EnumPermissionName[EnumPermission[body.permissions as keyof typeof EnumPermission]];
        }
    }
    return permissionDto;
}

