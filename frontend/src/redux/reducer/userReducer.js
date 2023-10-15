import { ActionTypes } from "../action-type";

const initialState = {
    status : "loading", //fulfill
    user : null,
}

export const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_USER:
            return {
                status : "fulfill",
                category: payload,
            }
    
        default:
            return state;
    }
}