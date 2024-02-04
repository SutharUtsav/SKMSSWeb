import { Sequelize } from "sequelize";
import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto, FamilyLookupDto } from "../dtos/family-dto";
import { Family } from "../model/family";
import { User } from "../model/user";
import { UserProfile, UserProfileImage } from "../model/userProfile";
import { BaseService } from "./base-service";
import { IUserService, UserService } from "./user-service";

const sequelize = require('../config/db')

export interface IFamilyService {
    /**
     * Get All Records of Family Entity 
     */
    GetRecords(lookup?: boolean, id?: number): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of Family by Id
     * @param id 
     */
    GetRecordById(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Create Record for Entity Family
     * @param dtoRecord 
     */
    Create(dtoRecord: FamilyDto): Promise<ApiResponseDto | undefined>;

    /**
     * Update Record in Family
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: FamilyDto, id: number): Promise<FamilyDto | ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;

}


export class FamilyService extends BaseService implements IFamilyService {
    /**
     * Get All Records of Family Entity 
     */
    public async GetRecords(lookup = false, id = undefined): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            if (lookup) {

                if (id) {
                    let family: FamilyLookupDto = await Family.findOne({
                        attributes: ['surname', 'village', 'villageGuj', 'mainFamilyMemberName'],
                        where: {
                            id: id
                        }
                    });

                    if (family) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = family
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
                    console.log("else")
                    let families: any = await sequelize.query(`
                    SELECT "Family"."surname", "Family"."village", "Family"."villageGuj", "Family"."mainFamilyMemberName", "UserProfileImage"."image"
                    FROM "Family" AS "Family"
                    JOIN "User" AS "User" ON "Family"."surname"="User"."surname" AND "Family"."mainFamilyMemberName"="User"."name"
                    LEFT OUTER JOIN "UserProfileImage" AS "UserProfileImage" ON "UserProfileImage"."userId"="User"."id"
                  `, { type: sequelize.QueryTypes.SELECT });;

                    if (families.length !== 0) {
                        console.log(families)

                        let response = [];
                        for (const family of families) {
                            let json = {
                                surname: family.surname,
                                village: family.village,
                                villageGuj: family.villageGuj,
                                mainFamilyMemberName: family.mainFamilyMemberName,
                                mainFamilyMemberImage: family.image ? `http://${process.env["LOCAL_URL"]}${process.env["LOCAL_SUBURL"]}/image/profile-image/${family.image}` : null 
                            }
                            response.push(json);
                        }

                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = response
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

                let families: FamilyDto[] = await Family.findAll({});

                if (families.length !== 0) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = families
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
     * Get Record of Family by Id
     * @param id 
     */
    public async GetRecordById(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let family: FamilyDto = await Family.findOne({
                where: {
                    id: id
                }
            });

            if (family) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = family;
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
     * Create Record for Entity Family
     * @param dtoRecord 
     */
    public async Create(dtoRecord: FamilyDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);


            //check if family already exist
            const foundFamily = await Family.findOne({
                where: {
                    surname: dtoRecord.surname,
                    village: dtoRecord.village,
                    currResidency: dtoRecord.currResidency,
                    adobeOfGod: dtoRecord.adobeOfGod,
                    goddess: dtoRecord.goddess,
                    mainFamilyMemberName: dtoRecord.mainFamilyMemberName
                }
            });

            if (foundFamily) {
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = "403";
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.DATA_ALREADY_EXIST];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            const family = await Family.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })

            //if user is not created
            if (!family) {
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
                family: family
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
     * Update Record in Family
     * @param dtoRecord 
     * @param id 
     */
    public async Update(dtoRecord: FamilyDto, id: number): Promise<FamilyDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {
            //check whether user exist or not
            let isFamily = await Family.findOne({
                where: {
                    id: id,
                }
            })

            if (isFamily) {

                let updatedRecord = await Family.update({
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
        let apiResponse!: ApiResponseDto | undefined;

        try {
            //check whether userProfile if found or not
            const userProfile = await UserProfile.findOne({
                where: {
                    familyId: id,
                }
            });

            //No entry of userProfile is found, then continue; else remove all those entries
            if (userProfile) {
                const findAllUsers = await UserProfile.findAll({
                    where: {
                        familyId: id,
                    },
                })


                //Remove users associated with familyId
                for (let i = 0; i < findAllUsers.length; i++) {
                    const users = findAllUsers[i];

                    const userService: IUserService = new UserService();
                    apiResponse = await userService.Remove(users.userId);

                    if (!apiResponse || apiResponse.status === 0) {
                        return apiResponse;
                    }
                }

            }

            const response = await Family.destroy({
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

}