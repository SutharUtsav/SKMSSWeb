import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
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
    Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto): Promise<ApiResponseDto | undefined>;

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

}

export class UserService extends BaseService implements IUserService {


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
    public async Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto): Promise<ApiResponseDto | undefined> {
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
            const userWithSameNumber =  await UserProfile.findOne({
                where: {
                    mobileNumber : dtoProfileRecord.mobileNumber,
                    countryCode : dtoProfileRecord.countryCode
                }
            })

            if(userWithSameNumber){
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = {
                    status: 0,
                    message : EnumApiResponseMsg[EnumApiResponse.USER_EXIST]
                }
                return apiResponse;
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
                const resp = await UserProfile.destroy({
                    where: {
                        userId: id,
                    },
                })

                if (resp === undefined || resp === null) {
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

                    if (userProfileImage) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = {
                            userProfileImage: userProfileImage
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

}