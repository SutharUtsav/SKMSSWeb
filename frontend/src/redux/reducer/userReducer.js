import { ActionTypes } from "../action-type";

const initialState = {
    user : null,
}

export const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_USER:
            return {
                user: payload,
            }
    
        default:
            return state;
    }
}