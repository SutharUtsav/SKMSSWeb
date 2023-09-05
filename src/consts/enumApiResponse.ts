export enum EnumApiResponse {
    UPDATED_SUCCESS,
    REMOVE_SUCCESS,
    DATA_ALREADY_EXIST,
    NO_DATA_FOUND,
    UNAUTHORIZED,
    USER_EXIST
}


export const EnumApiResponseMsg : Record <EnumApiResponse,string> = {
    [EnumApiResponse.UPDATED_SUCCESS] : "Record Updated Successfully",
    [EnumApiResponse.REMOVE_SUCCESS] : "Record Removed Successfully",
    [EnumApiResponse.DATA_ALREADY_EXIST] : "Data Already Exist!",
    [EnumApiResponse.NO_DATA_FOUND] : "No Data Found!",
    [EnumApiResponse.UNAUTHORIZED] : "UnAuthorized!",
    [EnumApiResponse.USER_EXIST] : "User Already Exist!",
}