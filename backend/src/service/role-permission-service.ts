import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, PermissionListDto } from "../dtos/role-dto";
import { RolePermission, RoleRolePermission } from "../model/role";
import { BaseService } from "./base-service";

export interface IRolePermissionService {

    /**
     * Get All Records of RolePermission Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of Role Entity by Id
     * @param id 
     */
    GetRecordById(id:number) : Promise<ApiResponseDto | undefined >;
    /**
     * Create Record for Entity RolePermission
     * @param dtoRecord typeof PermissionDto
     */
    Create(dtoRecord: PermissionDto): Promise<PermissionDto | ApiResponseDto | undefined>;

    /**
     * Update Record in RolePermission
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: PermissionDto, id: number): Promise<PermissionDto | ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;
}


export class RolePermissionService extends BaseService implements IRolePermissionService {
    /**
     * Get All Records of RolePermission Entity 
     * @returns 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            const permissions: PermissionListDto[] = await RolePermission.findAll();

            if (permissions.length !== 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { permissions }
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
            apiResponse.status = 0;
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.error = errorDto;
            return apiResponse;
        }

    }

    /**
     * Get Record of Role Entity by Id
     * @param id 
     */
    public async GetRecordById(id:number) : Promise<ApiResponseDto | undefined >{
        let apiResponse!: ApiResponseDto;
        try {

            const permission: PermissionListDto = await RolePermission.findOne({
                where : {
                    id:id
                }
            });

            if (permission) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { permission: permission }
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
            apiResponse.status = 0;
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }
    /**
     * Create Record for Entity RolePermission
     * @param dtoRecord 
     */
    public async Create(dtoRecord: PermissionDto): Promise<PermissionDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            //Check record already present or not
            const foundPermission = await RolePermission.findOne({ where: { permissions: dtoRecord.permissions, permissionFor: dtoRecord.permissionFor } })
            if (!foundPermission) {
                //if not present then create
                const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
                const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

                const rolePermission = await RolePermission.create({
                    ...dtoRecord,
                    createdAt: recordCreatedInfo.createdAt,
                    createdById: recordCreatedInfo.createdById,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById,
                    disabled: false,
                    enabledDisabledOn: new Date(),
                });

                if (rolePermission) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = { permissions: rolePermission.dataValues };
                    return apiResponse;
                }
                else {
                    return undefined;
                }
            } else {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.DATA_ALREADY_EXIST];
                apiResponse.error = errorDto;
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

    /**
     * Update Record in RolePermission
     * @param dtoRecord 
     * @param id 
     */
    public async Update(dtoRecord: PermissionDto, id: number): Promise<PermissionDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);
            dtoRecord.updatedAt = recordModifiedInfo.updatedAt;
            dtoRecord.updatedById = recordModifiedInfo.updatedById;
            let updatedRecord = await RolePermission.update(dtoRecord, {
                where: {
                    id: id
                }
            })

            if (updatedRecord !== undefined || updatedRecord !== null) {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 1;
                apiResponse.data = { status: parseInt(updatedRecord[0]), message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
                return apiResponse;
            }
            else {
                return undefined
            }

        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            apiResponse.status = 0;
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    public async Remove(id: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            //check whether roleRolePermission if found or not
            const roleRolePermissions = await RoleRolePermission.findAll({
                where: {
                    roleId: id,
                }
            });

            if (roleRolePermissions.length !== 0) {
                //No entry in roleRolePermission is found, then continue; else remove all those entries

                for (const element of roleRolePermissions) {
                    let rolePermission = element

                    const resp = await RoleRolePermission.destroy({
                        where: {
                            id: rolePermission.id,
                        },
                        cascade: true,
                    })

                    if (!resp) {
                        apiResponse = new ApiResponseDto()
                        apiResponse.status = 0;
                        let errorDto = new ErrorDto();
                        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                        apiResponse.error = errorDto;
                        return apiResponse;
                    }

                }
            }
            const response = await RolePermission.destroy({
                where: {
                    id: id
                }
            })

            if (response) {
                apiResponse = new ApiResponseDto()
                apiResponse.status = 1;
                apiResponse.data = { status: parseInt(response), message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
                return apiResponse;
            }
            else {

                apiResponse = new ApiResponseDto()
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }
        }
        catch (error: any) {
            apiResponse = new ApiResponseDto();
            apiResponse.status = 0;
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }

}