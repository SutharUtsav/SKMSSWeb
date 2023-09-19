import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumFamilyMemberRelation, EnumFamilyMemberRelationName } from "../consts/enumFamilyMemberRelation";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { UserDto, UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { Family } from "../model/family";
import { Role } from "../model/role";
import { User } from "../model/user";
import { UserProfile, UserProfileImage } from "../model/userProfile";
import { BaseService } from "./base-service";


export interface IUserService {

    /**
     * Get All Records of User Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of User by Id
     * @param id 
     */
    GetRecordById(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Create Record for Entity User
     * @param dtoRecord 
     */
    Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto): Promise<ApiResponseDto | undefined>;

    /**
     * Create Bulk Record for entity Family, User, UserProfile 
     * @param dtoUsersRecord 
     * @param dtoProfilesRecord 
     * @param dtoFamiliesRecord 
     */
    BulkInsert(dtoUsersRecord: Array<UserDto>, dtoProfilesRecord: Array<UserProfileDto>, dtoFamiliesRecord: Array<FamilyDto>) : Promise<ApiResponseDto | undefined>;
    
    /**
     * Update Record in User
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: UserDto, id: number): Promise<UserDto | ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;

    /**
     * Update User's Profile detail
     * @param dtoRecord 
     * @param id User's Id
     */
    UpdateUserProfile(dtoRecord: UserProfileDto, id: number): Promise<UserProfileDto | ApiResponseDto | undefined>;

    /**
     * Get User Details based on userId
     * @param id UserId
     */
    GetUserProfile(id: number): Promise<ApiResponseDto | undefined>;

    /**
     * Get User Profile Picture based on userId
     * @param id 
     */
    GetUserProfileImage(id: number): Promise<ApiResponseDto | undefined>;

    /**
     * Store User's Profile Picture
     * @param id User Id
     * @param dtoRecord User's Profile Picture
     */
    UploadUserProfileImage(id: number, dtoRecord: UserProfileImageDto | ErrorDto | undefined): Promise<ApiResponseDto | undefined>;

    /**
     * Remove User's Profile Picture 
     * @param id 
     */
    RemoveUserProfileImage(id: number): Promise<ApiResponseDto | undefined>;

    /**
     * Find User Id by User's details
     * @param name 
     * @param village 
     * @param surname 
     */
    findUserIdByDetails(name: string, village: string, surname: string): Promise<ApiResponseDto | undefined>;
}

export class UserService extends BaseService implements IUserService {

    fs = require('fs');
    path = require('path');


    //#region spicific services

    /**
     * Function to remove file from specific path
     * @param filePath 
     * @returns 
     */
    private RemoveImageFile(filePath: string) {
        const absoluteFilePath = this.path.resolve(filePath);

        // Check if the file exists before attempting to delete it
        if (this.fs.existsSync(absoluteFilePath)) {
            this.fs.unlink(absoluteFilePath, (err: any) => {
                if (err) {
                    return {
                        status: 0,
                        message: err
                    };
                }
                else {
                    return { status: 1 };
                }
            });
        }

        return { status: 1 }
    }

    /**
     * Create Bulk Record for entity Family, User, UserProfile 
     * @param dtoUsersRecord 
     * @param dtoProfilesRecord 
     * @param dtoFamiliesRecord 
     */
    public async BulkInsert(dtoUsersRecord: Array<UserDto>, dtoProfilesRecord: Array<UserProfileDto>, dtoFamiliesRecord: Array<FamilyDto>) : Promise<ApiResponseDto | undefined>{
        let apiResponse !:ApiResponseDto;

        try{
            const families = await Family.bulkCreate(dtoFamiliesRecord, {fields: ['surname','village','currResidency','adobeOfGod','goddess','lineage', 'residencyAddress', 'villageGuj']})

            const ids = await Family.findAll({ attributes: ['id'] })

            console.log("ids: ", ids)
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }
    

    //#endregion

    /**
     * Get All Records of User Entity 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let users: UserDto[] = await User.findAll({});

            if (users.length !== 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { users: users }
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;
            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Get Record of User Entity by Id
     * @param id 
     */
    public async GetRecordById(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let user: UserDto = await User.findOne({
                where: {
                    id: id
                }
            });

            if (user) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { user: user }
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;

            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Get User Details based on userId
     * @param id UserId
     */
    public async GetUserProfile(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let userProfile: UserProfileDto = await UserProfile.findOne({
                where: {
                    userId: id
                }
            });

            if (userProfile) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { userProfile: userProfile }
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;

            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Get User Profile Picture based on userId
     * @param id 
     */
    public async GetUserProfileImage(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let userProfileImage = await UserProfileImage.findOne({
                where: {
                    userId: id
                }
            });

            if (userProfileImage) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { userProfileImage: userProfileImage }
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;

            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Create Record for Entity User
     * @param dtoRecord 
     */
    public async Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            //check if role exist or not
            const role = await Role.findOne({
                where: {
                    id: dtoRecord.roleId
                }
            })

            if (!role) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            //check if user already exist with that same phone number
            const userWithSameDetails = await UserProfile.findOne({
                where: {
                    name: dtoProfileRecord.name,
                    mobileNumber: dtoProfileRecord.mobileNumber,
                    countryCode: dtoProfileRecord.countryCode
                }
            })

            if (userWithSameDetails) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = {
                    status: 0,
                    message: EnumApiResponseMsg[EnumApiResponse.USER_EXIST]
                }
                return apiResponse;
            }

            //Check if Family not exist then Create Entry for Family
            let family = await Family.findOne({
                where: {
                    surname: dtoFamilyRecord.surname,
                    village: dtoFamilyRecord.village,
                    currResidency: dtoFamilyRecord.currResidency,
                    adobeOfGod: dtoFamilyRecord.adobeOfGod,
                    goddess: dtoFamilyRecord.goddess
                }
            })

            if (!family) {
                family = await Family.create({
                    ...dtoFamilyRecord,
                    createdAt: recordCreatedInfo.createdAt,
                    createdById: recordCreatedInfo.createdById,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById,
                    disabled: false,
                    enabledDisabledOn: new Date(),
                })

                dtoProfileRecord.familyId = family.id;
            }
            else {
                dtoProfileRecord.familyId = family.id;
            }


            const user = await User.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })


            //if user is not created
            if (!user) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            //set mainFamilyMemberId
            if (dtoProfileRecord.mainFamilyMemberRelation = EnumFamilyMemberRelationName[EnumFamilyMemberRelation.SELF]) {
                dtoProfileRecord.mainFamilyMemberId = user.id;
            }
            else {
                const maniFamilyMember = await this.findUserIdByDetails(dtoProfileRecord.mainFamilyMemberName, dtoProfileRecord.mainFamilyMemberVillage, dtoProfileRecord.mainFamilyMemberSurname);

                if (maniFamilyMember?.status === 0) {
                    return maniFamilyMember
                }
                else if (maniFamilyMember?.data?.status === 0) {
                    dtoProfileRecord.mainFamilyMemberId = Number(null);
                }
                else {
                    dtoProfileRecord.mainFamilyMemberId = maniFamilyMember?.data.userId;
                }
            }

            //set mother Id
            const motherId = await this.findUserIdByDetails(dtoProfileRecord.motherName, dtoProfileRecord.motherVillage, dtoProfileRecord.motherSurname);

            if (motherId?.status === 0) {
                return motherId
            }
            else if (motherId?.data?.status === 0) {
                dtoProfileRecord.motherId = Number(null);
            }
            else {
                dtoProfileRecord.motherId = motherId?.data.userId;
            }

            //set father Id
            const fatherId = await this.findUserIdByDetails(dtoProfileRecord.fatherName, dtoProfileRecord.fatherVillage, dtoProfileRecord.fatherSurname);

            if (fatherId?.status === 0) {
                return fatherId
            }
            else if (fatherId?.data?.status === 0) {
                dtoProfileRecord.fatherId = Number(null);
            }
            else {
                dtoProfileRecord.fatherId = motherId?.data.userId;
            }


            const userProfile = await UserProfile.create({
                ...dtoProfileRecord,
                userId: user.id,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })


            //if userProfile is not created
            if (!userProfile) {
                //if user already created then return it
                if (user) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = {
                        user: user
                    }
                    return apiResponse;
                }

                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                user: user,
                userDetail: userProfile
            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
    * Update Record in User
    * @param dtoRecord 
    * @param id 
    */
    public async Update(dtoRecord: UserDto, id: number): Promise<UserDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {
            //check whether user exist or not
            let isUser = await User.findOne({
                where: {
                    id: id,
                }
            })

            if (isUser) {

                let updatedRecord = await User.update({
                    ...dtoRecord,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById
                }, {
                    where: {
                        id: id
                    }
                })


                if (updatedRecord !== undefined || updatedRecord !== null) {
                    apiResponse = new ApiResponseDto()
                    apiResponse.status = 1;
                    apiResponse.data = { status: parseInt(updatedRecord[0]), message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
                    return apiResponse;
                }
                else {
                    return undefined
                }
            }
            else {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }

        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    public async Remove(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {
            //check whether userProfile if found or not
            const userProfile = await UserProfile.findOne({
                where: {
                    userId: id,
                }
            });

            //No entry of userProfile is found, then continue; else remove all those entries
            if (userProfile) {
                const respRemoveImg = await UserProfileImage.destroy({
                    where: {
                        userId: id
                    }
                })

                const resp = await UserProfile.destroy({
                    where: {
                        userId: id,
                    },
                })


                if (resp === undefined || resp === null || respRemoveImg === null || respRemoveImg === undefined) {
                    apiResponse = new ApiResponseDto()
                    apiResponse.status = 0;
                    let errorDto = new ErrorDto();
                    errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                    errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                    apiResponse.error = errorDto;
                    return apiResponse;
                }
            }

            const response = await User.destroy({
                where: {
                    id: id
                },
                cascade: true,
            })

            if (response) {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 1;
                apiResponse.data = { status: parseInt(response), message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
                return apiResponse;
            }
            else {

                apiResponse = new ApiResponseDto()
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            apiResponse.status = 0;
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Update User's Profile detail
     * @param dtoRecord 
     * @param id User's Id
     */
    public async UpdateUserProfile(dtoRecord: UserProfileDto, id: number): Promise<UserProfileDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {

            //check whether user exist or not
            let isUserProfile = await UserProfile.findOne({
                where: {
                    userId: id,
                }
            })
            if (isUserProfile) {

                let updatedRecord = await UserProfile.update({
                    ...dtoRecord,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById
                }, {
                    where: {
                        userId: id
                    }
                })

                if (updatedRecord !== undefined || updatedRecord !== null) {
                    apiResponse = new ApiResponseDto()
                    apiResponse.status = 1;
                    apiResponse.data = { status: parseInt(updatedRecord[0]), message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
                    return apiResponse;
                }
                else {
                    return undefined
                }
            }
            else {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }


    /**
     * Store User's Profile Picture
     * @param id User Id
     * @param image User's Profile Picture
     */
    public async UploadUserProfileImage(id: number, dtoRecord: UserProfileImageDto | ErrorDto | undefined): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            //check whether user exist or not
            let user: UserDto = await User.findOne({
                where: {
                    id: id
                }
            });

            if (user) {
                //if user exist, check whether user's profile image is already exist or not

                let record = await UserProfileImage.findOne({
                    where: {
                        userId: id
                    }
                });
                const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
                const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

                if (record) {
                    //if userprofileImage already exist then update it

                    let updatedRecord = await UserProfileImage.update({
                        ...dtoRecord,
                        userId: id,
                        updatedAt: recordModifiedInfo.updatedAt,
                        updatedById: recordModifiedInfo.updatedById
                    }, {
                        where: {
                            userId: id
                        }
                    })

                    //update isImageAvailable field in User Table
                    let updateUser = await User.update({
                        isImageAvailable: true
                    }, {
                        where: {
                            id: id
                        }
                    })

                    if (updatedRecord !== undefined || updatedRecord !== null || updateUser !== undefined || updateUser !== null) {
                        apiResponse = new ApiResponseDto()
                        apiResponse.status = 1;
                        apiResponse.data = { status: parseInt(updatedRecord[0]), message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
                        return apiResponse;
                    }
                    else {
                        return undefined
                    }

                }
                else {
                    //else insert new entry for userProfileImage

                    let userProfileImage = UserProfileImage.create({
                        ...dtoRecord,
                        userId: id,
                        createdAt: recordCreatedInfo.createdAt,
                        createdById: recordCreatedInfo.createdById,
                        updatedAt: recordModifiedInfo.updatedAt,
                        updatedById: recordModifiedInfo.updatedById,
                        disabled: false,
                        enabledDisabledOn: new Date(),
                    });

                    //update isImageAvailable field in User Table
                    let updateUser = await User.update({
                        isImageAvailable: true
                    }, {
                        where: {
                            id: id
                        }
                    })

                    if (userProfileImage !== undefined || userProfileImage !== null || updateUser !== undefined || updateUser !== null) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = {
                            userProfileImage: {
                                status : 1,
                                message : EnumApiResponseMsg[EnumApiResponse.IMG_UPLOAD_SUCCESS]
                            }
                        }
                        return apiResponse;
                    }

                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 0;
                    let errorDto = new ErrorDto();
                    errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                    errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                    apiResponse.error = errorDto;
                    return apiResponse;

                }
            }
            else {
                return undefined;
            }
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }


    /**
     * Remove User's Profile Picture
     * @param id 
     */
    public async RemoveUserProfileImage(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            const foundUserProfile: UserProfileImageDto = await UserProfileImage.findOne({
                where: {
                    userId: id
                }
            })

            if (!foundUserProfile) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST];
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }

            const fileRemoveResp : any = await this.RemoveImageFile(foundUserProfile.image);
            const originalFileRemoveResp : any = await this.RemoveImageFile(foundUserProfile.originalImage);

            if (fileRemoveResp.status === 0 || originalFileRemoveResp.status === 0) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = fileRemoveResp?.message || originalFileRemoveResp?.message;
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }

            const resp = await UserProfileImage.destroy({
                where: {
                    userId: id
                }
            })
    
            const respUpdateUserField = await User.update({
                isImageAvailable: false
            }, {
                where: {
                    id: id
                }
            })
    
            if (!resp || !respUpdateUserField) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST];
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }
    
            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                status: 1,
                message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS]
            };
            return apiResponse;

        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    
    /**
     * Find User Id by User's details
     * @param name 
     * @param village 
     * @param surname 
     */
    public async findUserIdByDetails(name: string, village: string | undefined, surname: string | undefined, familyId: number | null = null): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            let userProfile = null;

            if (!name || !surname || !village) {
                return undefined;
            }

            //find family Id if not exist
            if (familyId == null) {

                familyId = await Family.findOne({
                    where: {
                        surname: surname,
                        village: village
                    }
                })


                if (!familyId) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = {
                        status: 0,
                        message: EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND] + ' username: ' + name
                    }
                    return apiResponse;
                }
            }

            userProfile = await UserProfile.findOne({
                where: {
                    name: name,
                    familyId: familyId
                }
            })

            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            if (userProfile) {
                apiResponse.data = {
                    userId: userProfile.userId,
                }
            }
            else {
                apiResponse.data = {
                    status: 0,
                    message: EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND] + 'for username: ' + name
                }
            }
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

}