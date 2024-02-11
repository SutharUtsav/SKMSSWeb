//this file includes all functions that checks validation for incoming req in api

import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumUserStatus, EnumUserStatusText } from "../consts/enumUserStatus";
import { ErrorDto } from "../dtos/api-response-dto";
import { EventDto, EventImageDto } from "../dtos/event-dto";
import { FamilyDto } from "../dtos/family-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { SamajWadiOccupiedDto } from "../dtos/samajwadi-occpied-dto";
import { SocialWorkerDto } from "../dtos/social-worker-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { areAllFieldsFilled } from "./heper";


//#region Regex validations

export const regexMobile = /^\+[1-9]\d{1,14}$/; ///^[7-9]\d{9}$/
export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const regexDate = /^\d{4}-\d{2}-\d{2}$/;

//#endregion



/**
 * Social Worker validation check
 * @param body 
 */
export const validateSocialWorker = (body : SocialWorkerDto) : SocialWorkerDto | ErrorDto | undefined => {
    let socialWorkerDto: SocialWorkerDto = new SocialWorkerDto();

    //check for all required fields
    if(!body.name || !body.surname || !body.village || !body.position ){
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    // set fields for SamajWadiOccupiedDto
    socialWorkerDto.name = body.name;
    socialWorkerDto.surname = body.surname;
    socialWorkerDto.village = body.village;
    socialWorkerDto.position = body.position;
    return socialWorkerDto;
}


/**
 * Samajwadi Occupied validation check
 * @param body 
 */
export const validateSamajwadiOccupied = (body : SamajWadiOccupiedDto) : SamajWadiOccupiedDto | ErrorDto | undefined => {
    let samajwadiOccupiedDto: SamajWadiOccupiedDto = new SamajWadiOccupiedDto();

    //check for all required fields
    if(!body.eventTitle || !body.eventDescription || !body.fromDate || !body.toDate || !body.fair || !body.totalDays ){
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    // set fields for SamajWadiOccupiedDto
    samajwadiOccupiedDto.eventTitle = body.eventTitle;
    samajwadiOccupiedDto.eventDescription = body.eventDescription;
    samajwadiOccupiedDto.isOccupied = true;
    samajwadiOccupiedDto.fair = body.fair;
    samajwadiOccupiedDto.fromDate = body.fromDate;
    samajwadiOccupiedDto.toDate = body.toDate;
    samajwadiOccupiedDto.totalDays = body.totalDays;
    return samajwadiOccupiedDto;
}

/**
 * Validation Check Function for Event Entity
 * @param body 
 */
export const validateEvent = (body : EventDto) : EventDto | ErrorDto | undefined => {
    let eventDto: EventDto = new EventDto();

    //check for all required fields
    if(!body.title || !body.description || !body.eventOn){
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    // set fields for EventDto
    eventDto.title = body.title;
    eventDto.description = body.description;
    eventDto.eventOn = body.eventOn;
    eventDto.isActivity = body.isActivity;
    eventDto.activityCategory = body.activityCategory ? body.activityCategory : null;
    return eventDto;
}

export const validateEventImages = (paths : string[]) : EventImageDto[] | ErrorDto | undefined => {
    let eventImageDtos: EventImageDto[] = [];

    paths?.map((imageURL : string) => {
        let eventImageDto : EventImageDto = new EventImageDto();
        eventImageDto.imageURL = imageURL;
        eventImageDto.isCoverImage = false;

        eventImageDtos.push(eventImageDto);
    })

    return eventImageDtos;
}

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
    if (!body.surname || !body.village || !body.villageGuj || !body.mainFamilyMemberName) {
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
    familyDto.adobeOfGod = body?.adobeOfGod;
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
    //removed || !body.wifeSurname || !body.marriedStatus || !body.birthDate || !body.weddingDate || !body.education || !body.occupation || !body.gender
    //        || !body.mainFamilyMemberSurname || !body.mainFamilyMemberVillage || !body.motherName || !body.motherSurname || !body.motherVillage || !body.fatherName || !body.fatherSurname || !body.fatherVillage
    if (!body.name || !body.countryCode || !body.mobileNumber || !body.email || !body.surname || !body.village || !body.villageGuj
        || !body.mainFamilyMemberRelation || !body.mainFamilyMemberName) {
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    //!regexMobile.test(body.mobileNumber) removed
    if ( body.email && !regexEmail.test(body.email)) {
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    if (body.birthDate) {

        if (!regexDate.test(String(body.birthDate))) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
    }
    if(body.weddingDate){

        if (!regexDate.test(String(body.weddingDate))) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
    }

    
    //set fields of UserDto
    userDto.name = body.name;
    // userDto.surname = body.surname;
    userDto.wifeSurname = body.wifeSurname;
    // userDto.city = body.city;
    // userDto.currResidency = body.currResidency;
    userDto.marriedStatus = body.marriedStatus;
    userDto.birthDate = !isNaN(Date.parse(String(body.birthDate))) ? new Date(body.birthDate).toISOString() : "";
    userDto.weddingDate = !isNaN(Date.parse(String(body.weddingDate))) ? new Date(body.weddingDate).toISOString() : "";
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
    //Later added fields after bulk Insert
    userDto.surname = body.surname;
    userDto.village = body.village;
    userDto.villageGuj = body.villageGuj;
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
    // removed || !body.roleId 
    if (!body.name || !body.surname || !body.village || !body.villageGuj) {
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
    userDto.name = body.name;
    userDto.userType = body.userType;
    userDto.villageGuj = body.villageGuj;
    // userDto.roleId = body.roleId;
    //Later Added Fields after bulk Insert
    userDto.surname = body.surname;
    userDto.village = body.village; 


    return userDto;
}


/**
 * Validation Check function for Role Entity 
 * @param body 
 * @returns 
 */
export const validateRole = (body: RoleDto): RoleDto | ErrorDto | undefined => {
    let roleDto: RoleDto = new RoleDto();

    // if (!areAllFieldsFilled(body)) {
    //     return undefined;
    // }
    // else {

    //set fields of RoleDto

    if (!body.name || !body.roleType || !body.description) {
        let errorDto = new ErrorDto();
        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        return errorDto;
    }

    roleDto.name = body.name;
    roleDto.description = body.description;
    roleDto.roleType = body.roleType;
    if (body.rolePermissionIds)
        roleDto.rolePermissionIds = String(body.rolePermissionIds).split(',').map(Number);
    //set roleType Field
    // if (EnumRoleType[body.roleType as keyof typeof EnumRoleType] === undefined) {
    //     let errorDto = new ErrorDto();
    //     errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
    //     errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
    //     return errorDto;
    // }
    // else {
    //     roleDto.roleType = EnumRoleTypeName[EnumRoleType[body.roleType as keyof typeof EnumRoleType]];
    // }
    // }

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

        permissionDto.permissionFor = body.permissionFor;
        permissionDto.permissions = body.permissions;

        //set permissionFor field
        // if (EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor] === undefined) {
        //     let errorDto = new ErrorDto();
        //     errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        //     errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        //     return errorDto;
        // }
        // else {
        //     permissionDto.permissionFor = EnumPermissionForName[EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor]];
        // }

        // //set permissions field
        // if (EnumPermission[body.permissions as keyof typeof EnumPermission] === undefined) {
        //     let errorDto = new ErrorDto();
        //     errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
        //     errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        //     return errorDto;
        // }
        // else {
        //     permissionDto.permissions = EnumPermissionName[EnumPermission[body.permissions as keyof typeof EnumPermission]];
        // }
    }
    return permissionDto;
}


//#region Validation Function for Bulk User Insert


export const validateBulkEntries = (row: any): any => {

    console.log(row)
    let userProfileDto: UserProfileDto = new UserProfileDto();
    let userDto: UserDto = new UserDto();
    let familyDto: FamilyDto = new FamilyDto();

    userDto.userType = EnumUserStatusText[EnumUserStatus.ADMINCREATED];
    userDto.name = row[1] ? String(row[1])?.trim() : "";
    userDto.surname = row[2] ? String(row[2])?.trim() : "";
    userDto.village = row[3] ? String(row[3])?.trim() : "";
    userDto.isImageAvailable = false;
    
    userProfileDto.name = row[1] ? String(row[1])?.trim(): "";
    userProfileDto.wifeSurname = row[10] ? String(row[10])?.trim() : null;
    userProfileDto.marriedStatus = row[11] ? String(row[11])?.trim() : "";
    userProfileDto.birthDate = !isNaN(Date.parse(row[12])) ? new Date(row[12]).toISOString() : '';
    userProfileDto.weddingDate = !isNaN(Date.parse(row[13])) ? new Date(row[13]).toISOString() : '';;
    userProfileDto.education = row[14] ? String(row[14])?.trim() : "";
    userProfileDto.occupation = row[15] ? String(row[15])?.trim() : "";
    userProfileDto.countryCode = row[16] ? String(row[16])?.trim() : "";
    userProfileDto.mobileNumber = row[17] ? String(row[17])?.trim() : "";
    userProfileDto.email = row[18].text ? row[18].text : String(row[18]).trim();
    userProfileDto.gender = row[19] ? String(row[19])?.trim().toUpperCase() : "";
    userProfileDto.mainFamilyMemberRelation = row[20] ? String(row[20])?.trim() : "";
    userProfileDto.surname = row[2] ? String(row[2])?.trim() : "";
    userProfileDto.village = row[3] ? String(row[3])?.trim() : "";
    userProfileDto.currResidency = row[5] ? String(row[5])?.trim() : "";
    userProfileDto.mainFamilyMemberName = row[21] ? String(row[21])?.trim(): "";
    userProfileDto.mainFamilyMemberSurname = row[22] ? String(row[22])?.trim() : "";
    userProfileDto.mainFamilyMemberVillage = row[23] ? String(row[23])?.trim() : "";
    userProfileDto.motherName = row[24] ? String(row[24])?.trim() : "";
    userProfileDto.motherSurname = row[25] ? String(row[25])?.trim() : "";
    userProfileDto.motherVillage = row[26] ? String(row[26])?.trim(): "";
    userProfileDto.fatherName = row[27] ? String(row[27])?.trim() : "";
    userProfileDto.fatherSurname = row[28] ? String(row[28])?.trim() : "";
    userProfileDto.fatherVillage = row[29] ? String(row[29])?.trim() : "";
    userProfileDto.password=""

    familyDto.surname = String(row[2])?.trim() === "undefined" ? null : String(row[2])?.trim();
    familyDto.village = String(row[3])?.trim() === "undefined" ? null : String(row[3])?.trim();
    familyDto.villageGuj = String(row[4])?.trim() === "undefined" ? null : String(row[4])?.trim();
    familyDto.currResidency = String(row[5])?.trim() === "undefined" ? null : String(row[5])?.trim();;
    familyDto.adobeOfGod = String(row[6])?.trim() === "undefined" ? null : String(row[6])?.trim();;
    familyDto.goddess = String(row[7])?.trim() === "undefined" ? null : String(row[7])?.trim();;
    familyDto.lineage = String(row[8])?.trim() === "undefined" ? null : String(row[8])?.trim();
    familyDto.residencyAddress = String(row[9])?.trim() === "undefined" ? null : String(row[9])?.trim();
    familyDto.mainFamilyMemberName = String(row[21])?.trim() === "undefined" ? null : String(row[21])?.trim();

    // const imageData = row[30] ? row[30] : null;

    // console.log(row[30])
    // console.log(imageData);
    // const img = new Image();


    // img.src = `data:image/png;base64,${imageData}`

    // console.log(img)
    return {
        userDto: userDto,
        userProfileDto: userProfileDto,
        familyDto: familyDto
    };
}

//#endregion