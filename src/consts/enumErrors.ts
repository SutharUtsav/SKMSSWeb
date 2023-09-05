export enum EnumErrorMsg { 
    API_BAD_REQUEST,
    API_SOMETHING_WENT_WRONG,
    API_RECORD_NOT_FOUND,
    API_UNAUTHORIZED,
}

export const EnumErrorMsgText : Record <EnumErrorMsg,string> = {
    [EnumErrorMsg.API_BAD_REQUEST] : "Bad Request",
    [EnumErrorMsg.API_SOMETHING_WENT_WRONG] : "Something Went Wrong!",
    [EnumErrorMsg.API_RECORD_NOT_FOUND] :"Record Not Found!",
    [EnumErrorMsg.API_UNAUTHORIZED]: "UnAuthorized",
} 

export const EnumErrorMsgCode : Record <EnumErrorMsg, number> = {
    [EnumErrorMsg.API_BAD_REQUEST] :400,
    [EnumErrorMsg.API_SOMETHING_WENT_WRONG] :400,
    [EnumErrorMsg.API_RECORD_NOT_FOUND] : 404,
    [EnumErrorMsg.API_UNAUTHORIZED] : 401,
    
}