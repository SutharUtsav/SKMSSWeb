/**
 * Dto for Error Fields
 */
export class ErrorDto {
    errorCode!:string;
    errorMsg!:string;
}

export class ApiResponseDto {
    status!:number;
    error!:ErrorDto;
    data!:any;
}