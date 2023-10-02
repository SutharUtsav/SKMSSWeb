import axios from "axios";
import { EnvConfig } from "../config/env-config";
const FormData = require('form-data');


/**
 * Method to call GET request api
 * @param endpoint 
 */
export const get = async (endpoint) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}${endpoint}`,
        headers: {}
    };

    return await axios.request(config);
}

/**
 * Method to call GET request api with id
 * @param endpoint
 * @param id
 */
// async getById(endpoint, id) {
//     return null
// }



export const add = async (endpoint, jsonData = null) => {

    if(jsonData=== null){
        return null;
    }

    let formData = new FormData();
    Object.keys(jsonData).forEach((data)=>{
        formData.append(data.toString(), jsonData[data].toString());
    })

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}${endpoint}`,
        headers: {},
        data: formData
    };

    return await axios.request(config);
}