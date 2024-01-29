import { EnumApiResponse, EnumApiResponseCode, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { EventDto, EventImageDto, EventImageFieldsArr, EventLookupDto } from "../dtos/event-dto";
import { RemoveFile } from "../helper/file-handling";
import { Events } from "../model/event";
import { EventImages } from "../model/eventImage";
import { BaseService } from "./base-service";

const sequelize = require('../config/db')

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
    Create(dtoRecord: EventDto): Promise<ApiResponseDto | undefined>;

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

    /**
     * Remove EventImageRecord by given parameter id
     * @param id 
     */
    RemoveEventImage(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Remove mainImage of Event
     * @param id 
     */
    RemoveEventMainImage(eventId: number): Promise<ApiResponseDto | undefined>

    /**
     * Get Event's Images by EventId 
     * @param eventId 
     * @returns 
     */
    GetEventImages(eventId: number): Promise<ApiResponseDto | undefined>;

    /**
     * Upload Event Images
     * @param dtoRecords 
     * @param id 
     */
    UploadImages(dtoRecords: EventImageDto[], id: number): Promise<ApiResponseDto | undefined>;

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
                            id: id
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
                apiResponse.data = event;
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
     * Get Event's Images by EventId 
     * @param eventId 
     * @returns 
     */
    public async GetEventImages(eventId: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        if (!eventId) {
            return undefined;
        }

        let eventImagesDto = await EventImages.findAll({
            where: {
                eventId: eventId
            },
            attributes: ['imageURL', 'isCoverImage']
        })

        if (!eventImagesDto) {
            return undefined;
        }

        apiResponse = new ApiResponseDto();
        if (eventImagesDto.length === 0) {
            let errorDto = new ErrorDto();
            apiResponse.status = 0;
            errorDto.errorCode = '200';
            errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
            apiResponse.error = errorDto;
        }
        else {
            apiResponse.status = 1;
            apiResponse.data = eventImagesDto
        }

        return apiResponse;
    }

    /**
     * Create Record for Entity Event
     * @param dtoRecord 
     */
    public async Create(dtoRecord: EventDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        const transaction = await sequelize.transaction();
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
            }, {
                row: true,
                transaction
            })

            // console.log("Event : ", event);

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

            let dtoImageRecord: EventImageDto = new EventImageDto();
            dtoImageRecord.eventId = event.id;
            dtoImageRecord.imageURL = dtoRecord.mainImageURL;
            dtoImageRecord.isCoverImage = true;
            dtoImageRecord.createdAt = recordCreatedInfo.createdAt;
            dtoImageRecord.createdById = recordCreatedInfo.createdById;
            dtoImageRecord.updatedAt = recordModifiedInfo.updatedAt;
            dtoImageRecord.updatedById = recordModifiedInfo.updatedById;


            const eventImages = await EventImages.create(dtoImageRecord, { transaction })

            // console.log("EventImages: ", eventImages)
            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                event: event
            }

            transaction.commit();

            return apiResponse;

        }
        catch (error: any) {
            transaction.rollback();
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
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {
            //check whether user exist or not
            let isEvent = await Events.findOne({
                where: {
                    id: id,
                },
                raw: true,
                attributes: ['id']
            })

            console.log(isEvent)
            if (isEvent) {

                let eventImages : EventImageDto = await EventImages.findOne({
                    where: {
                        eventId: id,
                        isCoverImage: true
                    },
                    raw: true,
                    attributes: ['id']
                })

            console.log( eventImages)

                if (eventImages) {

                    let updatedRecord = await Events.update({
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

                    let updatedRecord = await Events.update({
                        ...dtoRecord,
                        updatedAt: recordModifiedInfo.updatedAt,
                        updatedById: recordModifiedInfo.updatedById
                    }, {
                        where: {
                            id: id
                        }
                    })

                    const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);

                    let dtoImageRecord: EventImageDto = new EventImageDto();
                    dtoImageRecord.eventId = isEvent.id;
                    dtoImageRecord.imageURL = dtoRecord.mainImageURL;
                    dtoImageRecord.isCoverImage = true;
                    dtoImageRecord.createdAt = recordCreatedInfo.createdAt;
                    dtoImageRecord.createdById = recordCreatedInfo.createdById;
                    dtoImageRecord.updatedAt = recordModifiedInfo.updatedAt;
                    dtoImageRecord.updatedById = recordModifiedInfo.updatedById;


                    const isCreatedImages = await EventImages.create(dtoImageRecord)

                    if(!isCreatedImages || !updatedRecord){
                        return undefined;
                    }
                    // console.log("EventImages: ", eventImages)
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = { status: 200, message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };

                    return apiResponse;
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
            //check whether EventImages found or not
            const eventImages = await EventImages.findAll({
                where: {
                    eventId: id,
                },
                raw: true,
                attributes: ['imageURL']
            });

            //No entry of EventImages is found, then continue; else remove all those entries
            if (eventImages) {
                const respRemoveImg = await EventImages.destroy({
                    where: {
                        eventId: id
                    }
                })

                for (const eventImage of eventImages) {
                    await RemoveFile(eventImage.imageURL);
                }

                if (respRemoveImg === null || respRemoveImg === undefined) {
                    return undefined
                }
            }

            const resp = await Events.destroy({
                where: {
                    id: id,
                },
                cascade: true
            })

            if (resp === null || resp === undefined) {
                return undefined
            }


            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: EnumApiResponseCode[EnumApiResponse.REMOVE_SUCCESS], message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
            return apiResponse;

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
     * Remove EventImageRecord by given parameter id
     * @param id 
     */
    public async RemoveEventImage(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {
            //check whether EventImages found or not
            const eventImages = await EventImages.findOne({
                where: {
                    id: id,
                },
                attributes: ['imageURL']
            });

            //No entry of EventImages is found
            if (!eventImages) {
                return undefined;
            }

            await RemoveFile(eventImages.imageURL);

            const respRemoveImg = await EventImages.destroy({
                where: {
                    id: id
                }
            })

            if (respRemoveImg === null || respRemoveImg === undefined) {
                return undefined
            }

            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: EnumApiResponseCode[EnumApiResponse.REMOVE_SUCCESS], message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
            return apiResponse;

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
     * Remove mainImage of Event
     * @param id 
     */
    public async RemoveEventMainImage(eventId: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {
            //check whether EventImages found or not
            const eventImages = await EventImages.findOne({
                where: {
                    eventId: eventId,
                    isCoverImage: true
                },
                attributes: ['imageURL']
            });

            //No entry of EventImages is found
            if (!eventImages) {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 1;
                apiResponse.data = {
                    status: 200,
                    message: EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                }
                return apiResponse;
            }

            await RemoveFile(eventImages.imageURL);

            const respRemoveImg = await EventImages.destroy({
                where: {
                    eventId: eventId,
                    isCoverImage: true
                }
            })

            if (respRemoveImg === null || respRemoveImg === undefined) {
                return undefined
            }

            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: EnumApiResponseCode[EnumApiResponse.REMOVE_SUCCESS], message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
            return apiResponse;

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
     * Upload Event Images
     * @param dtoRecords 
     * @param id 
     */
    public async UploadImages(dtoRecords: EventImageDto[], id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            //check whether user exist or not
            let event = await Events.findOne({
                where: {
                    id: id
                },
                raw: true,
                attributes: ['id']
            });

            console.log("Event :", event);

            if (!event) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecords[0]);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecords[0]);

            for (const dtoRecord of dtoRecords) {
                dtoRecord.createdAt = recordCreatedInfo.createdAt;
                dtoRecord.createdById = recordCreatedInfo.createdById;
                dtoRecord.updatedAt = recordModifiedInfo.updatedAt;
                dtoRecord.updatedById = recordModifiedInfo.updatedById;
                dtoRecord.eventId = event.id;
            }

            let eventImage = await EventImages.bulkCreate(dtoRecords, { fields: EventImageFieldsArr });

            if (!eventImage) {
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

}