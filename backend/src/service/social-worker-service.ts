import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SocialWorkerDto } from "../dtos/social-worker-dto";
import { SocialWorker } from "../model/socialWorket";
import { User } from "../model/user";
import { UserProfileImage } from "../model/userProfile";
import { BaseService } from "./base-service";

export interface ISocialWorkerService {
    /**
     * Get All Records of SocialWorker Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Create Record for Entity Social Worker
     * @param dtoRecord 
     */
    Create(dtoRecord: SocialWorkerDto): Promise<ApiResponseDto | undefined>;

    // /**
    //  * Remove Record by given parameter id
    //  * @param id 
    //  */
    // Remove(id: number): Promise<ApiResponseDto | undefined>;
}



export class SocialWorkerService extends BaseService implements ISocialWorkerService {


    /**
     * Get All Records of SocialWorker Entity 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let socialWorkers: SocialWorkerDto[] = await SocialWorker.findAll({
                attributes: ['position'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'surname'],
                        include: [
                            {
                                model: UserProfileImage,
                                attributes: ['image'],
                                as: 'UserProfileImageId'
                            }
                        ]
                    }
                ]
            });

            if (socialWorkers.length !== 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = socialWorkers
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
     * Create Record for Entity Social Worker
     * @param dtoRecord 
     */
    public async Create(dtoRecord: SocialWorkerDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {


            // check for user exsistence
            const isUser = await User.findOne({
                where: {
                    name: dtoRecord.name,
                    surname: dtoRecord.surname,
                    village: dtoRecord.village
                },
                raw: true,
                attributes : ['id']
            })

            console.log(isUser);
            if (!isUser) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND];
                apiResponse.error = errorDto;
                return apiResponse;
            }
            else {
                const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
                const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

                const socialWorker = await SocialWorker.create({
                    position : dtoRecord.position,
                    userId: isUser.userId,
                    createdAt: recordCreatedInfo.createdAt,
                    createdById: recordCreatedInfo.createdById,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById,
                    disabled: false,
                    enabledDisabledOn: new Date(),
                })

                //if user is not created
                if (!socialWorker) {
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
                apiResponse.data = socialWorker
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
}