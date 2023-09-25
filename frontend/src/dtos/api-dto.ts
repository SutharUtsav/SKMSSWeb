/**
 * Dto for Error Fields
 */
export class ErrorDto {
    errorCode!:string;
    errorMsg!:string;
}

/**
 * Dto for Api Response
 */
export class ApiResponseDto {
    status!:number;
    error!:ErrorDto;
    data!:any;
}