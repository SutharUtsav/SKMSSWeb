import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { UserDto, UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { encrypt } from "../helper/encryption-handling";
import { Role, RolePermission, RoleRolePermission } from "../model/role";
import { User } from "../model/user";
import { UserProfile, UserProfileImage } from "../model/userProfile";
import { BaseService } from "./base-service";

var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export interface IAuthService {
    /**
     * Login to System
     */
    LoginWithMobile(mobileNumber: string): Promise<ApiResponseDto | undefined>;

    /**
     * Authenticate Community MeMber
     */
    AuthCommunityMember(email: string, name: string, password: string): Promise<ApiResponseDto | undefined>;
}


export class AuthService extends BaseService implements IAuthService {

    /**
     * Authenticate Community MeMber
     */
    public async AuthCommunityMember(email: string, name: string, password: string): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {


            let userProfile: UserProfileDto = await UserProfile.findOne({
                where: {
                    email: email,
                    name: name
                },
                attributes: ['userId', 'name', 'password']
            })

            if (userProfile) {

                let match:boolean;
                //check for user's password
                if(String(userProfile.name).toLowerCase() === 'admin'){

                    if(userProfile.password === process.env['ADMIN_PASSWORD']){
                        console.log("user password: true ", userProfile.password);
                        match = true;
                        
                    }
                    else{
                        console.log("user password: false", userProfile.password);

                        match = false;
                    }
                }
                else{
                    match = await bcrypt.compare(password, userProfile.password);
                }

                console.log("Match: ", match)

                if (match) {
                    

                    //userProfile found with given credentials

                    let user: UserDto = await User.findOne({
                        where: {
                            id: userProfile.userId
                        },
                        attributes: ['roleId', 'name', 'userType'],
                        raw: true
                    })


                    if (user) {

                        let userProfileImage: UserProfileImageDto = await UserProfileImage.findOne({
                            where: {
                                userId: userProfile.userId
                            },
                            attributes: ['image'],
                            raw: true
                        })

                        let role: RoleDto = await Role.findOne({
                            raw: true,
                            where: {
                                id: user.roleId
                            },
                            attributes: ['id', 'name']
                        })

                        if (role) {

                            // Generate an access token and a refresh token for the user.
                            const accessToken = jwt.sign({
                                name: user.name,
                                roleId: role.id,
                                role: role.name,
                                userType: user.userType,
                            }, process.env['JWT_SECRET'], { expiresIn: '1h' });

                            
                            apiResponse = new ApiResponseDto();
                            apiResponse.status = 1;
                            if(userProfileImage){
                                apiResponse.data = {
                                    user: {...user, roleName : role.name, userImage: `http://${process.env["LOCAL_URL"]}${process.env["LOCAL_SUBURL"]}/image/profile-image/${userProfileImage.image}`},
                                    accessToken: accessToken,
                                }    
                            }
                            else{
                                apiResponse.data = {
                                    user: {...user, roleName : role.name},
                                    accessToken: accessToken,
                                }
                            }
                            
                        }
                        else {
                            apiResponse = new ApiResponseDto();
                            let errorDto = new ErrorDto();
                            apiResponse.status = 0;
                            errorDto.errorCode = '200';
                            errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                            apiResponse.error = errorDto;
                        }
                    }
                    else {
                        apiResponse = new ApiResponseDto();
                        let errorDto = new ErrorDto();
                        apiResponse.status = 0;
                        errorDto.errorCode = '200';
                        errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                        apiResponse.error = errorDto;
                    }
                }
                else {
                    apiResponse = new ApiResponseDto();
                    let errorDto = new ErrorDto();
                    apiResponse.status = 0;
                    errorDto.errorCode = '200';
                    errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                    apiResponse.error = errorDto;
                }
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;
            }
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

    /**
     * Login to System
     */

    public async LoginWithMobile(mobileNumber: string): Promise<ApiResponseDto | undefined> {
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