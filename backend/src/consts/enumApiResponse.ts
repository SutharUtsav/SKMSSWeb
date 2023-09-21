export enum EnumApiResponse {
    UPDATED_SUCCESS,
    REMOVE_SUCCESS,
    DATA_ALREADY_EXIST,
    NO_DATA_FOUND,
    UNAUTHORIZED,
    USER_EXIST,
    IMG_UPLOAD_SUCCESS,
    DATA_UPLOAD_SUCCESS
}


export const EnumApiResponseMsg : Record <EnumApiResponse,string> = {
    [EnumApiResponse.UPDATED_SUCCESS] : "Record Updated Successfully",
    [EnumApiResponse.REMOVE_SUCCESS] : "Record Removed Successfully",
    [EnumApiResponse.DATA_ALREADY_EXIST] : "Data Already Exist!",
    [EnumApiResponse.NO_DATA_FOUND] : "No Data Found!",
    [EnumApiResponse.UNAUTHORIZED] : "UnAuthorized!",
    [EnumApiResponse.USER_EXIST] : "User Already Exist!",
    [EnumApiResponse.IMG_UPLOAD_SUCCESS] : "Image Uploaded Successfully",
    [EnumApiResponse.DATA_UPLOAD_SUCCESS] : "Data Uploaded Successfully",
}

export const EnumApiResponseCode : Record <EnumApiResponse, string> = {
    [EnumApiResponse.UPDATED_SUCCESS] : "200",
    [EnumApiResponse.REMOVE_SUCCESS] : "200",
    [EnumApiResponse.DATA_ALREADY_EXIST] : "409",
    [EnumApiResponse.NO_DATA_FOUND] : "503",
    [EnumApiResponse.UNAUTHORIZED] : '401',
    [EnumApiResponse.USER_EXIST] :'409',
    [EnumApiResponse.IMG_UPLOAD_SUCCESS] : '200',
    [EnumApiResponse.DATA_UPLOAD_SUCCESS] : '200',
}