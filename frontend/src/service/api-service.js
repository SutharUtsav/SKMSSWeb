import axios from "axios";


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

