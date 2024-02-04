import { Sequelize } from "sequelize";
import { EnumApiResponse, EnumApiResponseCode, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumFamilyMemberRelation, EnumFamilyMemberRelationName } from "../consts/enumFamilyMemberRelation";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto, familyFieldsArr } from "../dtos/family-dto";
import { RoleDto, RoleLookUpDto } from "../dtos/role-dto";
import { UserDto, UserProfileDto, UserProfileImageDto, UserProfileLookUpDto } from "../dtos/user-dto";
import { encrypt } from "../helper/encryption-handling";
import { RemoveFile } from "../helper/file-handling";
import { Family } from "../model/family";
import { Role } from "../model/role";
import { User, userFieldsArr } from "../model/user";
import { UserProfile, UserProfileFieldsArr, UserProfileImage } from "../model/userProfile";
import { BaseService } from "./base-service";
import { CommunicationService, ICommunicationService } from "./communication-service";

const sequelize = require('../config/db')
const bcrypt = require('bcrypt');
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
     * Get Record of User by email
     * @param email 
     */
    GetRecordByEmail(email: string): Promise<ApiResponseDto | undefined>

    /**
     * Create Record for Entity User
     * @param dtoRecord 
     */
    Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto, dtoRoleRecord: RoleLookUpDto): Promise<ApiResponseDto | undefined>;

    /**
     * Create Bulk Record for entity Family, User, UserProfile 
     * @param dtoUsersRecord 
     * @param dtoProfilesRecord 
     * @param dtoFamiliesRecord 
     */
    BulkInsert(dtoUsersRecord: Array<UserDto>, dtoProfilesRecord: Array<UserProfileDto>, dtoFamiliesRecord: Array<FamilyDto>): Promise<ApiResponseDto | undefined>;

    /**
     * Update Record in User
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto, dtoRoleRecord: RoleLookUpDto, id: number): Promise<UserDto | ApiResponseDto | undefined>;

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
     * Get All User Profiles detail
     * @param lookup 
     */
    GetUserProfiles(lookup?: boolean, id?: number): Promise<ApiResponseDto | undefined>;
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
    findUserIdByDetails(name: string, village: string, surname: string, mainFamilyMemberName: string): Promise<ApiResponseDto | undefined>;

    /**
     * Change User's Password 
     * @param name 
     * @param email 
     * @param oldPassword 
     * @param password 
     */
    ChangePassword(name: string, email: string, oldPassword: string, password: string): Promise<ApiResponseDto | undefined>;

    /**
     * Forgot User Password
     * @param name 
     * @param email 
     */
    ForgotPassword(name: string, email: string): Promise<ApiResponseDto | undefined>
}

export class UserService extends BaseService implements IUserService {


    //#region spicific services

    /**
     * Create Bulk Record for entity Family, User, UserProfile 
     * @param dtoUsersRecord 
     * @param dtoProfilesRecord 
     * @param dtoFamiliesRecord 
     */
    public async BulkInsert(dtoUsersRecord: Array<UserDto>, dtoProfilesRecord: Array<UserProfileDto>, dtoFamiliesRecord: Array<FamilyDto>): Promise<ApiResponseDto | undefined> {
        let apiResponse !: ApiResponseDto;

        // console.log("dtoUsersRecord: ", dtoUsersRecord);
        // console.log("dtoProfilesRecord: ", dtoProfilesRecord);
        // console.log("dtoFamiliesRecord: ", dtoFamiliesRecord);

        const transaction = await sequelize.transaction();
        try {
            const families = await Family.bulkCreate(dtoFamiliesRecord, { fields: familyFieldsArr, transaction, updateOnDuplicate: ['surname', 'village', 'villageGuj', 'mainFamilyMemberName'] })

            if (!families) {
                throw new Error("Error Occurs while Inserting Into Family Entity")
            }
            const familyArray = families.map((family: any) => family.dataValues)

            console.log("dtoUsersRecord: ", dtoUsersRecord);
            console.log("UserFieldsArr: ", userFieldsArr)
            const users = await User.bulkCreate(dtoUsersRecord, { fields: userFieldsArr, transaction, updateOnDuplicate: ['name', 'surname', 'village'] })

            if (!users) {
                throw new Error("Error Occurs while Inserting Into User Entity")
            }
            const userArray = users.map((user: any) => user.dataValues);

            const dtoProfileRecordPromise = dtoProfilesRecord.map(async (profileRecord: UserProfileDto) => {
                profileRecord.familyId = familyArray.find((family: FamilyDto) => family.surname === profileRecord.surname && family.village === profileRecord.village && family.currResidency === profileRecord.currResidency && profileRecord.mainFamilyMemberName === family.mainFamilyMemberName)?.id;

                if (profileRecord.mainFamilyMemberRelation?.toUpperCase() !== EnumFamilyMemberRelationName[EnumFamilyMemberRelation.SELF]) {
                    profileRecord.isMainFamilyMember = false;

                }
                else {
                    profileRecord.isMainFamilyMember = true;
                }


                const mainFamilyMemberUserId = userArray.find((user: UserDto) => user.name === profileRecord.mainFamilyMemberName && user.surname === profileRecord.mainFamilyMemberSurname && user.village === profileRecord.mainFamilyMemberVillage)?.id;

                profileRecord.mainFamilyMemberId = mainFamilyMemberUserId;

                profileRecord.userId = userArray.find((user: UserDto) => user.name === profileRecord.name && user.surname === profileRecord.surname && user.village === profileRecord.village)?.id


                const father: UserDto = userArray.find((user: UserDto) => user.name === profileRecord.fatherName && user.surname === profileRecord.fatherSurname && user.village === profileRecord.fatherVillage);
                if (father) {
                    profileRecord.fatherId = father.id;
                    profileRecord.fatherName = father.name;
                }
                else {
                    profileRecord.fatherId = null;
                    profileRecord.fatherName = null;
                }

                const mother = userArray.find((user: UserDto) => user.name === profileRecord.motherName && user.surname === profileRecord.motherSurname && user.village === profileRecord.motherVillage);
                if (mother) {
                    profileRecord.motherId = mother.id;
                    profileRecord.motherName = mother.name;
                }
                else {
                    profileRecord.motherId = null;
                    profileRecord.motherName = null;
                }

                const password = `Family${profileRecord.familyId}@User${profileRecord.userId}`;
                // console.log(password);
                const saltRounds = await bcrypt.genSaltSync(12);
                profileRecord.password = await bcrypt.hash(password, saltRounds)
                // console.log(profileRecord.password)
            })

            await Promise.all(dtoProfileRecordPromise);

            console.log("dtoProfilesRecord: ", dtoProfilesRecord);
            const userProfiles = await UserProfile.bulkCreate(dtoProfilesRecord, { fields: [...UserProfileFieldsArr, 'password'], transaction, updateOnDuplicate: ['name', 'surname', 'village'] })
            if (!userProfiles) {
                throw new Error("Error Occurs while Inserting Into UserProfile Entity")
            }

            // Send mail to each users
            dtoProfilesRecord.forEach((profileRecord: UserProfileDto) => {
                //Sent Mail
                //Mail Body
                const mailBody = `
                User Created:
                UserName: ${profileRecord.name}
                Password: ${profileRecord.password}
                `
                const communicationService: ICommunicationService = new CommunicationService();
                const response = communicationService.SendMail(profileRecord.email, mailBody);
            });


            await transaction.commit();
            // await transaction.rollback();
            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = {
                status: EnumApiResponseCode[EnumApiResponse.DATA_UPLOAD_SUCCESS],
                message: EnumApiResponseMsg[EnumApiResponse.DATA_UPLOAD_SUCCESS]
            }
            return apiResponse;
        }
        catch (error: any) {
            console.log("Error", error)
            await transaction.rollback();
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
      * Change User's Password 
      * @param name 
      * @param email 
      * @param oldPassword 
      * @param password 
     */
    public async ChangePassword(name: string, email: string, oldPassword: string, password: string): Promise<ApiResponseDto | undefined> {
        let apiResponse !: ApiResponseDto;
        const transaction = await sequelize.transaction();

        try {
            let user = await UserProfile.findOne({
                where: {
                    name: name,
                    email: email
                },
                attributes: ['userId', 'password']
            })


            console.log("User", user);
            if (user) {

                //check for user's password
                const match = await bcrypt.compare(oldPassword, user.password);

                if (match) {
                    const saltRounds = 12;
                    const newPassword = await bcrypt.hash(password, saltRounds);

                    let updateRecord = await UserProfile.update({
                        password: newPassword
                    }, {
                        where: {
                            userId: user.userId
                        },
                        transaction
                    })

                    if (updateRecord === null || updateRecord === undefined) {
                        return undefined;
                    }

                    else {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = {
                            status: 1,
                            message: "Successfully Changed Password"
                        }
                    }
                }
                else {
                    apiResponse = new ApiResponseDto();
                    let errorDto = new ErrorDto();
                    apiResponse.status = 0;
                    errorDto.errorCode = '200';
                    errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                    apiResponse.error = errorDto;
                }
            } else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;

            }
            await transaction.commit();
            return apiResponse;
        } catch (error: any) {
            await transaction.rollback();
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
     * Forgot Password
     * @param name 
     * @param email 
     */
    public async ForgotPassword(name: string, email: string): Promise<ApiResponseDto | undefined> {
        let apiResponse !: ApiResponseDto;
        const transaction = await sequelize.transaction();

        try {

            let user = await UserProfile.findOne({
                where: {
                    name: name,
                    email: email
                },
                attributes: ['userId', 'familyId', 'password']
            })

            console.log("User", user);

            if (user) {
                const password = `Family${user.familyId}@User${user.userId}`;
                const saltRounds = 12;
                const newPassword = await bcrypt.hash(password, saltRounds);

                let updateRecord = await UserProfile.update({
                    password: newPassword
                }, {
                    where: {
                        userId: user.userId
                    },
                    transaction
                })

                if (updateRecord === null || updateRecord === undefined) {
                    return undefined;
                }

                else {

                    //Sent Mail
                    //Mail Body
                    const mailBody = `
                    Password Updated:
                    UserName: ${name}
                    Password: ${password}`

                    const communicationService: ICommunicationService = new CommunicationService();
                    const response = await communicationService.SendMail(email, mailBody);

                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = {
                        status: 1,
                        message: "Password Sent to your Email"
                    }
                }
            } else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;
            }

            await transaction.commit();
            return apiResponse;
        } catch (error: any) {
            await transaction.rollback();
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
                apiResponse.data = users
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
                apiResponse.data = user;
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
     * Get Record of User Entity by email
     * @param email 
     */
    public async GetRecordByEmail(email: string): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            // let users: UserDto[] = await User.findAll({
            //     // attributes: [Sequelize.col('UserProfile.name'), Sequelize.col('UserProfileImage.image')],
            //     attributes: ['"UserProfileId"."name"', '"UserProfileImageId"."image"'],
            //     include: [
            //         {
            //             model: UserProfile,
            //             as: 'UserProfileId',
            //             where: {
            //                 email: email
            //             },
            //             attributes: ['name'],

            //         },
            //         {
            //             model: UserProfileImage,
            //             as: 'UserProfileImageId',
            //             attributes: ['image'],
            //             required: false,
            //             on: {
            //                 userId: Sequelize.literal('"UserProfileId"."userId"')
            //             },
            //             association: {
            //                 source: User,
            //                 target: UserProfileImage,
            //                 identifier: 'userId',
            //             },
            //         }
            //     ]
            // });

            let users: any = await User.findAll({
                attributes: [],
                include: [
                    {
                        model: UserProfile,
                        as: 'UserProfileId',
                        where: {
                            email: email,
                        },
                        on: {
                            userId: Sequelize.literal('"User"."id"="UserProfileId"."userId"')
                        },
                        attributes: ['name'],
                    },
                    {
                        model: UserProfileImage,
                        as: 'UserProfileImageId',
                        attributes: ['image'],
                        required: false,        // LEFT OUTER JOIN
                        on: {
                            userId: Sequelize.literal('"User"."id"="UserProfileImageId"."userId"'),
                        },
                    },
                ],
            });


            if (users.length !== 0) {
                let response = [];
                
                for (const user of users) {
                    let json = {
                        name: user.UserProfileId.name,
                        image: user.UserProfileImageId?.image ? `http://${process.env['LOCAL_URL']}${process.env['LOCAL_SUBURL']}/image/profile-image/${user.UserProfileImageId.image}` : null 
                    }

                    response.push(json);
                }

                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = response;
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
                },
                attributes: UserProfileFieldsArr
            });

            if (userProfile) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = userProfile
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
     * Get All User Profiles detail
     * @param lookup 
     */
    public async GetUserProfiles(lookup: boolean = false, id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            if (lookup) {
                if (id) {
                    let userProfile: UserProfileLookUpDto = await UserProfile.findOne({
                        raw: true,
                        attributes: ['name', 'surname', 'village', 'gender'],
                        where: {
                            userId: id
                        }
                    });

                    if (userProfile) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = userProfile
                    }
                    else {
                        apiResponse = new ApiResponseDto();
                        let errorDto = new ErrorDto();
                        apiResponse.status = 0;
                        errorDto.errorCode = '200';
                        errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                        apiResponse.error = errorDto;

                    }
                }
                else {

                    let userProfile: UserProfileLookUpDto[] = await UserProfile.findAll({
                        raw: true,
                        attributes: ['name', 'surname', 'village', 'gender']
                    });

                    if (userProfile) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = userProfile
                    }
                    else {
                        apiResponse = new ApiResponseDto();
                        let errorDto = new ErrorDto();
                        apiResponse.status = 0;
                        errorDto.errorCode = '200';
                        errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                        apiResponse.error = errorDto;

                    }
                }
                return apiResponse;
            }
            else {
                let userProfile: UserProfileDto[] = await UserProfile.findAll({
                    raw: true,
                });

                if (userProfile) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = userProfile
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
                userProfileImage.image = `http://${process.env["LOCAL_URL"]}${process.env["LOCAL_SUBURL"]}/image/profile-image/${userProfileImage.image}`
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = userProfileImage;
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
    public async Create(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto, dtoRoleRecord: RoleLookUpDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        const transaction = await sequelize.transaction();
        try {
            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            //check if role exist or not
            const role = await Role.findOne({
                where: {
                    name: dtoRoleRecord.name,
                    description: dtoRoleRecord.description,
                    roleType: dtoRoleRecord.roleType
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
            dtoRecord.roleId = role.id;

            // //check if user already exist with that same phone number
            // const userWithSameDetails = await UserProfile.findOne({
            //     where: {
            //         name: dtoProfileRecord.name,
            //         mobileNumber: dtoProfileRecord.mobileNumber,
            //         countryCode: dtoProfileRecord.countryCode
            //     }
            // })

            // if (userWithSameDetails) {
            //     apiResponse = new ApiResponseDto();
            //     apiResponse.status = 1;
            //     apiResponse.data = {
            //         status: 0,
            //         message: EnumApiResponseMsg[EnumApiResponse.USER_EXIST]
            //     }
            //     return apiResponse;
            // }

            //Check if Family not exist or not
            let family = await Family.findOne({
                where: {
                    surname: dtoFamilyRecord.surname,
                    village: dtoFamilyRecord.village,
                    villageGuj: dtoFamilyRecord.villageGuj,
                    mainFamilyMemberName: dtoFamilyRecord.mainFamilyMemberName
                }
            })

            if (!family) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = "Family " + EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND];
                apiResponse.error = errorDto;
                return apiResponse;
            }


            dtoProfileRecord.familyId = family.id;
            const user = await User.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            }, { transaction })


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
            if (dtoProfileRecord.mainFamilyMemberRelation === EnumFamilyMemberRelationName[EnumFamilyMemberRelation.SELF]) {
                dtoProfileRecord.mainFamilyMemberId = user.id;
            }
            else {
                const maniFamilyMember = await this.findUserIdByDetails(dtoProfileRecord.mainFamilyMemberName, dtoProfileRecord.mainFamilyMemberVillage, dtoProfileRecord.mainFamilyMemberSurname, dtoProfileRecord.mainFamilyMemberName);

                console.log("MainFamilyMember", maniFamilyMember)

                if (maniFamilyMember?.status === 0) {
                    return maniFamilyMember
                }
                else if (maniFamilyMember?.data?.status === 0) {
                    dtoProfileRecord.mainFamilyMemberId = Number(null);
                    throw maniFamilyMember.data.message;
                }
                else {
                    dtoProfileRecord.mainFamilyMemberId = maniFamilyMember?.data.userId;
                }
            }

            //set mother Id
            const motherId = await this.findUserIdByDetails(dtoProfileRecord.motherName, dtoProfileRecord.motherVillage, dtoProfileRecord.motherSurname, dtoProfileRecord.mainFamilyMemberName);
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
            const fatherId = await this.findUserIdByDetails(dtoProfileRecord.fatherName, dtoProfileRecord.fatherVillage, dtoProfileRecord.fatherSurname, dtoProfileRecord.mainFamilyMemberName);

            if (fatherId?.status === 0) {
                return fatherId
            }
            else if (fatherId?.data?.status === 0) {
                dtoProfileRecord.fatherId = Number(null);
            }
            else {
                dtoProfileRecord.fatherId = fatherId?.data.userId;
            }

            const password = `Family${family.id}@User${user.id}`;
            const saltRounds = await bcrypt.genSaltSync(12);
            dtoProfileRecord.password = await bcrypt.hash(password, saltRounds)


            const userProfile = await UserProfile.create({
                ...dtoProfileRecord,
                userId: user.id,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            }, { transaction })


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

            await transaction.commit();

            //Sent Mail
            //Mail Body
            const mailBody = `
            User Created:
            UserName: ${dtoProfileRecord.name}
            Password: ${password}
            `
            const communicationService: ICommunicationService = new CommunicationService();
            const response = await communicationService.SendMail(dtoProfileRecord.email, mailBody);

            console.log(response);

            return apiResponse;
        }
        catch (error: any) {
            console.log("ERROR", error)
            await transaction.rollback();
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
    public async Update(dtoRecord: UserDto, dtoProfileRecord: UserProfileDto, dtoFamilyRecord: FamilyDto, dtoRoleRecord: RoleLookUpDto, id: number): Promise<UserDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        const transaction = await sequelize.transaction();
        try {
            //check whether user exist or not
            let isUser = await User.findOne({
                where: {
                    id: id,
                }
            })

            let isUserProfile = await UserProfile.findOne({
                where: {
                    userId: id
                }
            })

            if (isUser && isUserProfile) {

                //check if role exist or not
                const role = await Role.findOne({
                    where: {
                        name: dtoRoleRecord.name,
                        description: dtoRoleRecord.description,
                        roleType: dtoRoleRecord.roleType
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
                dtoRecord.roleId = role.id;

                //Check if Family not exist or not
                let family = await Family.findOne({
                    where: {
                        surname: dtoFamilyRecord.surname,
                        village: dtoFamilyRecord.village,
                        villageGuj: dtoFamilyRecord.villageGuj,
                        mainFamilyMemberName: dtoFamilyRecord.mainFamilyMemberName
                    }
                })

                if (!family) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 0;
                    let errorDto = new ErrorDto();
                    errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                    errorDto.errorMsg = "Family " + EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND];
                    apiResponse.error = errorDto;
                    return apiResponse;
                }
                dtoProfileRecord.familyId = family.id;

                let updatedRecord = await User.update({
                    ...dtoRecord,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById
                }, {
                    where: {
                        id: id
                    },
                    transaction
                })


                //set mainFamilyMemberId
                if (dtoProfileRecord.mainFamilyMemberRelation === EnumFamilyMemberRelationName[EnumFamilyMemberRelation.SELF]) {
                    dtoProfileRecord.mainFamilyMemberId = id;
                }
                else {
                    const maniFamilyMember = await this.findUserIdByDetails(dtoProfileRecord.mainFamilyMemberName, dtoProfileRecord.mainFamilyMemberVillage, dtoProfileRecord.mainFamilyMemberSurname, dtoProfileRecord.mainFamilyMemberName);

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
                const motherId = await this.findUserIdByDetails(dtoProfileRecord.motherName, dtoProfileRecord.motherVillage, dtoProfileRecord.motherSurname, dtoProfileRecord.mainFamilyMemberName);
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
                const fatherId = await this.findUserIdByDetails(dtoProfileRecord.fatherName, dtoProfileRecord.fatherVillage, dtoProfileRecord.fatherSurname, dtoProfileRecord.mainFamilyMemberName);

                if (fatherId?.status === 0) {
                    return fatherId
                }
                else if (fatherId?.data?.status === 0) {
                    dtoProfileRecord.fatherId = Number(null);
                }
                else {
                    dtoProfileRecord.fatherId = fatherId?.data.userId;
                }


                let updatedProfileRecord = await UserProfile.update({
                    ...dtoProfileRecord,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById
                }, {
                    where: {
                        userId: id
                    },
                    transaction
                })

                if (updatedRecord !== undefined || updatedRecord !== null || updatedProfileRecord !== undefined || updatedProfileRecord !== null) {
                    apiResponse = new ApiResponseDto()
                    apiResponse.status = 1;
                    apiResponse.data = { status: parseInt(updatedRecord[0]), message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };

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
            }

            await transaction.commit();
            return apiResponse;
        }
        catch (error: any) {
            await transaction.rollback();
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
                        apiResponse.data = EnumApiResponseMsg[EnumApiResponse.IMG_UPLOAD_SUCCESS]
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

            const fileRemoveResp: any = await RemoveFile('Images/Profile-Webp' + foundUserProfile.image);
            const originalFileRemoveResp: any = await RemoveFile(foundUserProfile.originalImage);

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
    public async findUserIdByDetails(name: string | null, village: string | undefined, surname: string | undefined, mainFamilyMemberName: string | undefined, familyId: number | null = null): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            let userProfile = null;

            if (!name || !surname || !village || !mainFamilyMemberName) {
                return undefined;
            }

            //find family Id if not exist
            if (familyId == null) {

                let tmpfamily = await Family.findOne({
                    where: {
                        surname: surname,
                        village: village,
                        mainFamilyMemberName: mainFamilyMemberName
                    },
                    attributes: ['id']
                })

                familyId = tmpfamily.id


                if (!tmpfamily) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = {
                        status: 0,
                        message: EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND] + ' name: ' + name
                    }
                    return apiResponse;
                }
            }

            console.log("FamilyID", familyId)
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
                    message: EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND] + ' for name: ' + name
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