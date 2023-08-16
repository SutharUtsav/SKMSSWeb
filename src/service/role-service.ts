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

    /**
     * Update Record in Role
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: RoleDto, id: number): Promise<RoleDto | ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;
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

            //check if role with user-typed roleType is already present or not
            const foundRole = await Role.findAll({
                where: {
                    roleType: dtoRecord.roleType
                }
            });

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            let role;
            let errorMessage = "";

            if (foundRole.length === 0) {
                //if not then create entry for Role and RoleRolePermission

                role = await Role.create({
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
            }
            else {
                role = foundRole[0].dataValues;
                errorMessage = EnumApiResponseMsg[EnumApiResponse.DATA_ALREADY_EXIST];
            }

            //else create entry for only RoleRolePermission
            for (const rolePermissionId of dtoRecord.rolePermissionIds) {
                //check whether roleRolePermission already exist or not
                const foundRoleRolePermission = await RoleRolePermission.findOne({
                    where: {
                        roleId: role.id,
                        rolePermissionId: rolePermissionId,
                    }
                })
                if (!foundRoleRolePermission) {
                    //if not then create
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
                else {
                    errorMessage = EnumApiResponseMsg[EnumApiResponse.DATA_ALREADY_EXIST];
                }
            }
            apiResponse = new ApiResponseDto();
            if (errorMessage === "") {
                apiResponse.status = 1;
                apiResponse.data = { role: role };
            }
            else {
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = "403";
                errorDto.errorMsg = errorMessage;
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
     * Update Record in Role
     * @param dtoRecord 
     * @param id 
     */
    public async Update(dtoRecord: RoleDto, id: number): Promise<RoleDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {
            const roleDto = new RoleDto();
            roleDto.id = dtoRecord.id;
            roleDto.name = dtoRecord.name;
            roleDto.description = dtoRecord.description;
            roleDto.updatedAt = recordModifiedInfo.updatedAt;
            roleDto.updatedById = recordModifiedInfo.updatedById as number;

            let updatedRecord = await Role.update(roleDto, {
                where: {
                    id: id
                }
            })

            if (!updatedRecord) {
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
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
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

            const response = await Role.destroy({
                where: {
                    id: id
                },
                cascade: true,
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