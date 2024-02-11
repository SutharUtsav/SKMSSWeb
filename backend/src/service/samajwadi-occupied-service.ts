import { Op } from "sequelize";
import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SamajWadiOccupiedDto } from "../dtos/samajwadi-occpied-dto";
import { SamajwadiOccupied } from "../model/samajwadiOccupied";
import { BaseService } from "./base-service";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";

export interface ISamajwadiOccupiedService {
    /**
     * Get All Records of SamajWadiOccupied Entity by given Month 
     */
    GetRecordsByMonth(month: number, year: number, lookup: boolean): Promise<ApiResponseDto | undefined>;

    /**
     * Create Record for Entity Samajwadi Occupied
     * @param dtoRecord 
     */
    Create(dtoRecord: SamajWadiOccupiedDto): Promise<ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;
}


export class SamajwadiOccupiedService extends BaseService implements ISamajwadiOccupiedService {

    /**
     * Get All Records of SamajWadiOccupied Entity by given Month 
     */
    public async GetRecordsByMonth(month: number, year: number, lookup: boolean = false): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            if (lookup) {

                let events: SamajWadiOccupiedDto[] = await SamajwadiOccupied.findAll({
                    where: {
                        fromDate: {
                            [Op.gte]: new Date(year, month - 1, 1),
                        }
                    },
                    raw: true,
                    attributes: ['id','eventTitle', 'eventDescription', 'fromDate', 'toDate']
                });

                if (events.length !== 0) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = events
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
            else {

                let events: SamajWadiOccupiedDto[] = await SamajwadiOccupied.findAll({
                    where: {
                        fromDate: {
                            [Op.gte]: new Date(year, month - 1, 1),
                        }
                    }
                });

                if (events.length !== 0) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = events
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
     * Create Record for Entity Samajwadi Occupied
     * @param dtoRecord 
     */
    public async Create(dtoRecord: SamajWadiOccupiedDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {
            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            const samajwadiOccupied = await SamajwadiOccupied.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })

            //if user is not created
            if (!samajwadiOccupied) {
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
            apiResponse.data = samajwadiOccupied
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
     * Remove Record by given parameter id
     * @param id 
     */
    public async Remove(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto | undefined;

        try {

            const response = await SamajwadiOccupied.destroy({
                where: {
                    id: id
                },
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