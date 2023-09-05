import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { User } from "../model/user";
import { UserProfile } from "../model/userProfile";
import { BaseService } from "./base-service";

var jwt = require('jsonwebtoken');

export interface IAuthService {
    /**
     * Login to System
     */
    Login(mobileNumber: string): Promise<ApiResponseDto | undefined>;
}


export class AuthService extends BaseService implements IAuthService {
    /**
     * Login to System
     */

    public async Login(mobileNumber: string): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            //find user with mobile number exist or not
            let userProfile: any = await UserProfile.findOne({
                where: {
                    mobileNumber: mobileNumber
                }
            })

            if (userProfile) {
                //user exist

                let user: UserDto = await User.findOne({
                    where: {
                        id: userProfile.userId
                    }
                })

                if (user) {
                    // Generate an access token and a refresh token for the user.
                    const accessToken = jwt.sign({ user }, process.env['JWT_SECRET'], { expiresIn: '1h' });

                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = {
                        user: user,
                        accessToken: accessToken,
                    }
                    return apiResponse;
                }
                else {
                    return undefined;
                }

            }
            else {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = {
                    status: 1,
                    message: EnumApiResponseMsg[EnumApiResponse.UNAUTHORIZED]
                }
                return apiResponse;
            }
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