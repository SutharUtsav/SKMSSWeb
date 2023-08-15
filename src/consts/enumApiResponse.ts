export enum EnumApiResponse {
    UPDATED_SUCCESS,
    REMOVE_SUCCESS,
    DATE_ALREADY_EXIST,
    NO_DATA_FOUND
}


export const EnumApiResponseMsg : Record <EnumApiResponse,string> = {
    [EnumApiResponse.UPDATED_SUCCESS] : "Record Updated Successfully",
    [EnumApiResponse.REMOVE_SUCCESS] : "Record Removed Successfully",
    [EnumApiResponse.DATE_ALREADY_EXIST] : "Data Already Exist!",
    [EnumApiResponse.NO_DATA_FOUND] : "No Data Found!",
}