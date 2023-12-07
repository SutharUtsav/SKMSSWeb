import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";

const nodemailer = require('nodemailer')

export interface ICommunicationService {

    /**
     * Send Mail to gmail account
     * @param toEmail 
     */
    SendMail(toEmail : string, mailBody : string) : Promise<ApiResponseDto | undefined>;

    /**
     * Send Whatsapp Message
     */
    SendWhatsAppMessage() : Promise<ApiResponseDto | undefined>;
}

export class CommunicationService implements ICommunicationService {

    /**
     * Send Mail to gmail account
     * @param toEmail 
     */
    public async SendMail(toEmail: string, mailBody : string): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        console.log("In sendMail")

        try{

            let config ={
                service: 'gmail',
                auth: {
                    user: process.env['MAIL_USERNAME'],
                    pass: process.env['GMAIL_APP_PASSWORD']
                }
            }

            let transporter = nodemailer.createTransport(config);
            let message = {
                from: process.env['MAIL_USERNAME'],
                to : toEmail,
                subject : "Test Mail",
                text : mailBody
            }

            transporter.sendMail(message, (error:any, data:any)=> {
                if(error){
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 0;
                    apiResponse.data = error.toString();
                    console.log(error)
                }
                else{
                    console.log(data)
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = 'Mail send successfuly';
                    console.log("Mail send successfull")
                }
            })

            /* 
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: process.env['MAIL_USERNAME'],
                  pass: process.env['MAIL_PASSWORD'],
                  clientId: process.env['OAUTH_CLIENTID'],
                  clientSecret: process.env['OAUTH_CLIENT_SECRET'],
                  refreshToken: process.env['OAUTH_REFRESH_TOKEN']
                }
              });
            
        
            let mailOptions = {
                from : process.env['MAIL_USERNAME'],
                to : toEmail,
                subject : "Test Mail",
                text : mailBody
            }
            transporter.sendMail(mailOptions, (error:any, data:any)=> {
                if(error){
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 0;
                    apiResponse.data = error.toString();
                    console.log(error)
                }
                else{
                    console.log(data)
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = 'Mail send successfuly';
                    console.log("Mail send successfull")
                }
            })
            */
            return apiResponse;


        }
        catch (error: any) {
            console.log(error)
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Send Whatsapp Message    
     */
    public async SendWhatsAppMessage(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try{
            
            return apiResponse;
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }
}