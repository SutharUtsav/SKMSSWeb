import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, PermissionListDto, RoleDto } from "../dtos/role-dto";
import { Role, RolePermission, RoleRolePermission } from "../model/role";
import { BaseService } from "./base-service";

export interface IRoleService {

    /**
     * Get All Records of Role Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Create Record for Entity Role
     * @param dtoRecord 
     */
    Create(dtoRecord: RoleDto): Promise<RoleDto | ApiResponseDto | undefined>;
}

export interface IRolePermissionService {

    /**
     * Get All Records of RolePermission Entity 
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

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

export class RoleService extends BaseService implements IRoleService {

    /**
     * Get All Records of RolePermission Entity 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            let roles: RoleDto[] | RoleDto = await Role.findAll({
                raw: true
            });

            console.log(roles)
            if (!roles) {
                return undefined;
            }
            else if (roles instanceof RoleDto) {
                const permissionIds: [] = await RoleRolePermission.findAll({
                    where: {
                        roleId: roles.id
                    },
                    raw: true,
                })
                roles = {
                    ...roles,
                    permissions: permissionIds
                }
            }
            else {
                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i];
                    const permissionIds: [] = await RoleRolePermission.findAll({
                        where: {
                            roleId: role.id
                        }
                    })

                    role = {
                        ...role,
                        permissions: permissionIds
                    }
                    roles[i] = role
                }
            }


            if (roles) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { roles: roles }
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
     * Create Record for Entity Role
     * @param dtoRecord 
     */
    public async Create(dtoRecord: RoleDto): Promise<RoleDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            const role = await Role.create({
                name: dtoRecord.name,
                description: dtoRecord.description,
                roleType: dtoRecord.roleType,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            });

            if (!role) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }
            else {

                for (const rolePermissionId of dtoRecord.rolePermissionIds) {
                    const roleRolePermission = await RoleRolePermission.create({
                        roleId: role.id,
                        rolePermissionId: rolePermissionId,
                        createdAt: recordCreatedInfo.createdAt,
                        createdById: recordCreatedInfo.createdById,
                        updatedAt: recordModifiedInfo.updatedAt,
                        updatedById: recordModifiedInfo.updatedById,
                        disabled: false,
                        enabledDisabledOn: new Date(),
                    })

                    if (!roleRolePermission) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 0;
                        let errorDto = new ErrorDto();
                        errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                        errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                        apiResponse.error = errorDto;
                        return apiResponse;
                    }

                }
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { role:  role.dataValues  };
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

export class RolePermissionService extends BaseService implements IRolePermissionService {
    /**
     * Get All Records of RolePermission Entity 
     * @returns 
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            const permissions: PermissionListDto[] = await RolePermission.findAll();

            if (permissions) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { permissions: permissions }
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
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.DATE_ALREADY_EXIST];
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
            let updatedRecord = await RolePermission.update(dtoRecord, {
                where: {
                    id: id
                }
            })

            if (updatedRecord) {
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
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.APT_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.APT_RECORD_NOT_FOUND]
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