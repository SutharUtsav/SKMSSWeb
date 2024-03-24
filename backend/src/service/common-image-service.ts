import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { CommonImagesDto } from "../dtos/common-imaages-dto";
import { RemoveFile } from "../helper/file-handling";
import { CommonImages } from "../model/commonImages";
import { BaseService } from "./base-service";

export interface ICommonImagesService {
    /**
     * Get All Records of CommonImages Entity or Get By Category
     */
    GetRecords(category?: string): Promise<ApiResponseDto | undefined>;

    /**
     * Create Record for Entity Common Images
     * @param dtoRecord 
     */
    Create(dtoRecord: CommonImagesDto): Promise<ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;
}


export class CommonImagesService extends BaseService implements ICommonImagesService {
    /**
     * Get All Records of CommonImages Entity 
     */
    public async GetRecords(category?: string): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let commonImages: CommonImagesDto[] | null = null;
            
            if(category){
                commonImages = await CommonImages.findAll({
                    where: {
                        category : category
                    },
                    raw: true
                })
            }else{
                commonImages = await CommonImages.findAll({
                    raw: true
                });
            }

            if (!commonImages || commonImages.length !== 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = commonImages ? await Promise.all(commonImages.map((commonImage: CommonImagesDto) => ({
                    ...commonImage,
                    imageURL: commonImage.imageURL ? `http://${process.env["LOCAL_URL"]}${process.env["LOCAL_SUBURL"]}/image/common-image/${commonImage.imageURL}` : null,
                }))) : [];
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
     * Create Record for Entity Common Images
     * @param dtoRecord 
     */
    public async Create(dtoRecord: CommonImagesDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            dtoRecord.createdAt = recordCreatedInfo.createdAt;
            dtoRecord.createdById = recordCreatedInfo.createdById;
            dtoRecord.updatedAt = recordModifiedInfo.updatedAt;
            dtoRecord.updatedById = recordModifiedInfo.updatedById;

            let commonImage = await CommonImages.create(dtoRecord);

            if (!commonImage) {
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
            apiResponse.data = EnumApiResponseMsg[EnumApiResponse.IMG_UPLOAD_SUCCESS]
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


    public async Remove(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            const foundCommonImage: CommonImagesDto = await CommonImages.findOne({
                where: {
                   id : id
                }
            })

            console.log("foundCommonImage :"+foundCommonImage.toString());

            if (!foundCommonImage) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST];
                
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }

            
            const fileRemoveResp: any = await RemoveFile('Images/Common-Webp/' + foundCommonImage.imageURL);
            
            console.log("fileRemoveResp :"+fileRemoveResp.status);

            if (fileRemoveResp.status === (0||-1)) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = fileRemoveResp?.message;
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }

            const resp = await CommonImages.destroy({
                where: {
                    id: id
                }
            })

            
            if (!resp ) {
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


}