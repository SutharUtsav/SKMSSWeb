import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { User } from "../model/user";
import { BaseService } from "./base-service";

export interface IUserService {

    /**
     * Get All Records of User Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of User by Id
     * @param id 
     */
    GetRecordById(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Create Record for Entity User
     * @param dtoRecord 
     */
    Create(dtoRecord: UserDto, dtoProfileRecord : UserProfileDto): Promise< ApiResponseDto | undefined>;
}

export class UserService extends BaseService implements IUserService {

    /**
     * Get All Records of User Entity 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let users: UserDto[] = await User.findAll({});

            if (users.length !== 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { users: users }
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
     * Get Record of Role Entity by Id
     * @param id 
     */
    public async GetRecordById(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let user: UserDto = await User.findOne({
                where: {
                    id: id
                }
            });

            if (user) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { user: user }
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
     * Create Record for Entity User
     * @param dtoRecord 
     */
    public async Create(dtoRecord: UserDto, dtoProfileRecord : UserProfileDto): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            const user = await User.create({
                ...dtoRecord,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            })

            

            if (!user) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }
            else{
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