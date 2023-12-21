import { ApiResponseDto } from "../dtos/api-response-dto";
import { EventDto } from "../dtos/event-dto";
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

}

export class EventService extends BaseService implements IEventService {
    /**
     * Get All Records of Event Entity 
     */
    public async GetRecords(lookup?: boolean | undefined, id?: number | undefined): Promise<ApiResponseDto | undefined> {
        throw new Error("Method not implemented.");
    }

    /**
     * Get Record of Event by Id
     * @param id 
     */
    public async GetRecordById(id: number): Promise<ApiResponseDto | undefined> {
        throw new Error("Method not implemented.");
    }

    /**
     * Create Record for Entity Event
     * @param dtoRecord 
     */
    public async Create(dtoRecord: EventDto): Promise<ApiResponseDto | undefined> {
        throw new Error("Method not implemented.");
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