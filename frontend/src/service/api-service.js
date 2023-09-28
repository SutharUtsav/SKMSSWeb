import axios from "axios";
const FormData = require('form-data');

/**
 * Method to call GET request api
 * @param endpoint 
 */
export const get = async (endpoint) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3303/api/v1${endpoint}`,
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

    let data = new FormData();
    Object.keys(jsonData).forEach((data)=>{
        data.append(data, jsonData[data]);
    })

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `localhost:3303/api/v1${endpoint}`,
        headers: {
            ...data.getHeaders()
        },
        data: data
    };

    return await axios.request(config);

}