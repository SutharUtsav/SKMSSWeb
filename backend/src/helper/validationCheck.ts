//this file includes all functions that checks validation for incoming req in api

import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumFamilyMemberRelation, EnumFamilyMemberRelationName } from "../consts/enumFamilyMemberRelation";
import { EnumPermission, EnumPermissionName } from "../consts/enumPermission";
import { EnumPermissionFor, EnumPermissionForName } from "../consts/enumPermissionFor";
import { EnumRoleType, EnumRoleTypeName } from "../consts/enumRoleType";
import { EnumUserStatus, EnumUserStatusText } from "../consts/enumUserStatus";
import { ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { UserDto, UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { areAllFieldsFilled } from "./heper";


//#region Regex validations

export const regexMobile = /^[7-9]\d{9}$/;
export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//#endregion

/**
 * Validation Check Function for Family Entity
 * @param body 
 */
export const validateFamily = (body: FamilyDto): FamilyDto | ErrorDto | undefined => {
    let familyDto: FamilyDto = new FamilyDto();

    // if (!areAllFieldsFilled(body)) {
    //     return undefined;
    // }
    // else {
    // }

    //check all required fields
    if (!body.surname || !body.village || !body.currResidency || !body.adobeOfGod || !body.goddess || !body.residencyAddress || !body.villageGuj || !body.mainFamilyMemberName) {
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    //set Field to FamilyDto
    familyDto.surname = body.surname;
    familyDto.village = body.village;
    familyDto.villageGuj = body.villageGuj;
    familyDto.currResidency = body.currResidency;
    familyDto.adobeOfGod = body.adobeOfGod;
    familyDto.goddess = body.goddess;
    familyDto.lineage = body.lineage;
    familyDto.residencyAddress = body.residencyAddress;
    familyDto.mainFamilyMemberName = body.mainFamilyMemberName;

    return familyDto;
}

/**
 * Validation Check function for User-profile Entity
 * @param body 
 * @returns 
 */
export const validateUserProfile = (body: UserProfileDto): UserProfileDto | ErrorDto | undefined => {
    let userDto: UserProfileDto = new UserProfileDto();


    // if (!areAllFieldsFilled(body)) {
    //     return undefined;
    // }
    // else {
    // }


    //check all required files
    if (!body.name || !body.wifeSurname || !body.marriedStatus || !body.birthDate || !body.weddingDate || !body.education || !body.occupation || !body.countryCode || !body.mobileNumber || !body.email || !body.gender
        || !body.mainFamilyMemberRelation || !body.mainFamilyMemberName || !body.mainFamilyMemberSurname || !body.mainFamilyMemberVillage
        || !body.motherName || !body.motherSurname || !body.motherVillage || !body.fatherName || !body.fatherSurname || !body.fatherVillage) {
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
    // userDto.surname = body.surname;
    userDto.wifeSurname = body.wifeSurname;
    // userDto.city = body.city;
    // userDto.currResidency = body.currResidency;
    userDto.marriedStatus = body.marriedStatus;
    userDto.birthDate = new Date(body.birthDate);
    userDto.weddingDate = new Date(body.weddingDate);
    userDto.education = body.education;
    userDto.occupation = body.occupation;
    userDto.mobileNumber = body.mobileNumber;
    userDto.countryCode = body.countryCode;
    userDto.email = body.email;
    userDto.gender = body.gender;
    userDto.mainFamilyMemberName = body.mainFamilyMemberName;
    userDto.mainFamilyMemberRelation = body.mainFamilyMemberRelation;
    userDto.mainFamilyMemberSurname = body.mainFamilyMemberSurname;
    userDto.mainFamilyMemberVillage = body.mainFamilyMemberVillage;
    userDto.fatherName = body.fatherName;
    userDto.fatherSurname = body.fatherSurname;
    userDto.fatherVillage = body.fatherVillage;
    userDto.motherName = body.motherName;
    userDto.motherSurname = body.motherSurname;
    userDto.motherVillage = body.motherVillage;
    return userDto;
}

/**
 * Validation Check function for User Entity
 * @param body 
 * @returns 
 */
export const validateUser = (body: UserDto): UserDto | ErrorDto | undefined => {
    let userDto: UserDto = new UserDto();



    // if (!areAllFieldsFilled(body)) {
    //     return undefined;
    // }
    // else {

    // }

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


//#region Validation Function for Bulk User Insert


export const validateBulkEntries = (row: any):any=> {
    let userProfileDto: UserProfileDto = new UserProfileDto();
    let userDto : UserDto = new UserDto();
    let familyDto : FamilyDto = new FamilyDto();

    userDto.userType = EnumUserStatusText[EnumUserStatus.ADMINCREATED];
    userDto.username = String(row[1])?.trim();
    userDto.surname = String(row[2])?.trim();
    userDto.village = String(row[3])?.trim();

    userProfileDto.name = String(row[1])?.trim();
    userProfileDto.wifeSurname = String(row[10])?.trim();
    userProfileDto.marriedStatus = String(row[11])?.trim();
    userProfileDto.birthDate = new Date(row[12]);
    userProfileDto.weddingDate = new Date(row[13]);
    userProfileDto.education = String(row[14])?.trim();
    userProfileDto.occupation = String(row[15])?.trim();
    userProfileDto.countryCode = String(row[16])?.trim();
    userProfileDto.mobileNumber = String(row[17])?.trim();
    userProfileDto.email = row[18].text ? row[18].text : String(row[18]).trim;
    userProfileDto.gender = String(row[19])?.trim().toUpperCase();
    userProfileDto.mainFamilyMemberRelation = String(row[20])?.trim();
    userProfileDto.surname = String(row[2])?.trim();
    userProfileDto.village = String(row[3])?.trim();
    userProfileDto.currResidency = String(row[5])?.trim();
    userProfileDto.mainFamilyMemberName = String(row[21])?.trim();
    userProfileDto.mainFamilyMemberSurname = String(row[22])?.trim();
    userProfileDto.mainFamilyMemberVillage = String(row[23])?.trim();
    userProfileDto.motherName = String(row[24])?.trim();
    userProfileDto.motherSurname = String(row[25])?.trim();
    userProfileDto.motherVillage = String(row[26])?.trim();
    userProfileDto.fatherName = String(row[27])?.trim();
    userProfileDto.fatherSurname = String(row[28])?.trim();
    userProfileDto.fatherVillage = String(row[29])?.trim();    

    familyDto.surname = String(row[2])?.trim()=== "undefined" ? null : String(row[2])?.trim();
    familyDto.village = String(row[3])?.trim()=== "undefined" ? null : String(row[3])?.trim();
    familyDto.villageGuj = String(row[4])?.trim()=== "undefined" ? null : String(row[4])?.trim();
    familyDto.currResidency = String(row[5])?.trim()=== "undefined" ? null : String(row[5])?.trim();;
    familyDto.adobeOfGod = String(row[6])?.trim() === "undefined" ? null : String(row[6])?.trim();;
    familyDto.goddess = String(row[7])?.trim()=== "undefined" ? null : String(row[7])?.trim();;
    familyDto.lineage = String(row[8])?.trim() === "undefined" ? null : String(row[8])?.trim();
    familyDto.residencyAddress = String(row[9])?.trim()=== "undefined" ? null : String(row[9])?.trim();
    familyDto.mainFamilyMemberName = String(row[21])?.trim()=== "undefined" ? null : String(row[21])?.trim();

    
    return {
        userDto : userDto, 
        userProfileDto: userProfileDto, 
        familyDto :familyDto
    };
}

//#endregion