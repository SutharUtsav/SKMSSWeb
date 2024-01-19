import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { EventDto, EventImageDto, EventImageFieldsArr, EventLookupDto } from "../dtos/event-dto";
import { Events } from "../model/event";
import { EventImages } from "../model/eventImage";
import { BaseService } from "./base-service";

export interface IEventService {
    /**
     * Get All Records of Event Entity 
     */
    GetRecords(lookup?: boolean, id?: number): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of Event by Id
     * @param id 
     */
    GetRecordById(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Create Record for Entity Event
     * @param dtoRecord 
     * @param dtoImageRecords 
     */
    Create(dtoRecord: EventDto, dtoImageRecords: EventImageDto[]): Promise<ApiResponseDto | undefined>;

    /**
     * Update Record in Event
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: EventDto, id: number): Promise<EventDto | ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;

}

export class EventService extends BaseService implements IEventService {
    /**
     * Get All Records of Event Entity 
     */
    public async GetRecords(lookup?: boolean | undefined, id?: number | undefined): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            if (lookup) {

                if (id) {
                    let event: EventLookupDto = await Events.findOne({ 
                        attributes: ['title', 'description', 'eventOn'],
                        where: {
                            id : id
                        }
                    });

                    if (event) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = event
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

                    let events: EventLookupDto[] = await Events.findAll({ attributes: ['title', 'description', 'eventOn'] });

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
                }
                return apiResponse;
            }
            else {

                let events: EventDto[] = await Events.findAll({});

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
     * Get Record of Event by Id
     * @param id 
     */
    public async GetRecordById(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let event: EventDto = await Events.findOne({
                where: {
                    id: id
                }
            });

            if (event) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data =  event;
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
     * Create Record for Entity Event
     * @param dtoRecord 
     */
    public async Create(dtoRecord: EventDto, dtoImageRecords: EventImageDto[]): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            const event = await Events.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })

            console.log("Event : ", event);

            //if user is not created
            if (!event) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            for (const dtoImageRecord of dtoImageRecords) {
                dtoImageRecord.createdAt = recordCreatedInfo.createdAt;
                dtoImageRecord.createdById = recordCreatedInfo.createdById;
                dtoImageRecord.updatedAt = recordModifiedInfo.updatedAt;
                dtoImageRecord.updatedById = recordModifiedInfo.updatedById;
            }

            console.log("dtoImageRecords :", dtoImageRecords);

            const eventImages = await EventImages.bulkCreate(dtoImageRecords, { fields: EventImageFieldsArr })

            console.log("EventImages: ", eventImages)
            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                event: event
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
     * Update Record in Event
     * @param dtoRecord 
     * @param id 
     */
    public async Update(dtoRecord: EventDto, id: number): Promise<ApiResponseDto | EventDto | undefined> {
        throw new Error("Method not implemented.");
    }

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    public async Remove(id: number): Promise<ApiResponseDto | undefined> {
        throw new Error("Method not implemented.");
    }

}