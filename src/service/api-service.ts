import { ApiResponseDto } from "../dtos/api-dto";
import axios from "axios";

/**
 * Interface for Apis
 */
export interface IApiService{
    /**
     * Method to call GET request api
     * @param endpoint 
     */
    get(endpoint : string);

    /**
     * Method to call GET request api with id
     * @param endpoint 
     * @param id 
     */
    getById(endpoint : string, id:number);


}

export class ApiService implements IApiService{
    /**
     * Method to call GET request api
     * @param endpoint 
     */
    public async get(endpoint: string) {
        
        const response : ApiResponseDto = await axios.get(`${process.env['LOCAL_URL']}${process.env['LOCAL_SUBURL']}/${endpoint}`);
        return response;
    }

    /**
     * Method to call GET request api with id
     * @param endpoint 
     * @param id 
     */
    public async getById(endpoint : string, id:number){
        return null
    }
    
}