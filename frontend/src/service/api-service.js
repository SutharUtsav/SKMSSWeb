import axios from "axios";

export class ApiService{
    /**
     * Method to call GET request api
     * @param endpoint 
     */
    async get(endpoint) {
        
        const response = await axios.get(`localhost:3300/api/v1/${endpoint}`);
        return response;
    }

    /**
     * Method to call GET request api with id
     * @param endpoint 
     * @param id 
     */
    async getById(endpoint, id){
        return null
    }
    
}