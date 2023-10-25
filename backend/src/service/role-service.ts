import { EnumApiResponse, EnumApiResponseCode, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, PermissionListDto, RoleDto, RoleLookUpDto, RoleRolePermissionLookupDto } from "../dtos/role-dto";
import { Role, RolePermission, RoleRolePermission } from "../model/role";
import { BaseService } from "./base-service";

export interface IRoleService {

    /**
     * Get All Records of Role Entity 
     */
    GetRecords(lookup ?: boolean, id?: number | undefined): Promise<ApiResponseDto | undefined>;

    /**
     * Get Record of Role by Id
     * @param id 
     */
    GetRecordById(id: number): Promise<ApiResponseDto | undefined>

    /**
     * Get Id of a role from role type
     * @param roleType 
     */
    GetIdByRoleType(roleType: string): Promise<ApiResponseDto | undefined>;

    /**
     * Get Permission detais of the role
     */
    GetRolePermissions(roleId: number): Promise<ApiResponseDto | undefined>;

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
     * Update Permissions associated with Role
     * @param rolePermissions 
     * @param roleId 
     */
    UpdateRolePermission(rolePermissions: Array<number>, roleId: number): Promise<ApiResponseDto | undefined>;

    /**
     * Remove Record by given parameter id
     * @param id 
     */
    Remove(id: number): Promise<ApiResponseDto | undefined>;
}


export class RoleService extends BaseService implements IRoleService {

    /**
     * Get All Records of Role Entity 
     */
    public async GetRecords(lookup: boolean = false, id: number | undefined = undefined): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        
        try {
            if(lookup){

                if(id){
                    let role: RoleLookUpDto = await Role.findOne({
                        raw: true,
                        attributes : ['name', 'description', 'roleType'],
                        where : {
                            id : id
                        }
                    });
    
                    if (role) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = role
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
                else{
                    let roles: RoleLookUpDto[] = await Role.findAll({
                        raw: true,
                        attributes : ['name', 'description', 'roleType']
                    });
    
                    if (roles) {
                        apiResponse = new ApiResponseDto();
                        apiResponse.status = 1;
                        apiResponse.data = roles
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
                
                return apiResponse;
            }
            else{
                let roles: RoleDto[] = await Role.findAll({
                    raw: true
                });
                if (roles) {
                
                    for( const role of roles) {
                        let permissions : RoleRolePermissionLookupDto[] = await RoleRolePermission.findAll({
                            where: {
                                roleId : role.id
                            },
                            raw: true,
                            attributes :['roleId', 'rolePermissionId'] 
                        });
                        if(permissions){
                            role.permissionIds = permissions;
                        }else{
                            role.permissionIds = [];
                        }
                    };
                    
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = roles
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
            let role: RoleDto = await Role.findOne({
                where: {
                    id: id
                }
            });

            if (role) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { roles: role }
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
    * Get Id of a role from role type
    * @param roleType 
    */
    public async GetIdByRoleType(roleType: string): Promise<ApiResponseDto | undefined> {
        let apiResponse = new ApiResponseDto();

        try {
            let roleId = await Role.findOne({
                where: {
                    roleType: roleType
                },
                attributes: ['id']
            })

            if (!roleId) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumApiResponseCode[EnumApiResponse.NO_DATA_FOUND];
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND];
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }

            apiResponse.status = 1;
            apiResponse.data = {
                id: roleId.dataValues.id
            }

            return apiResponse
        } catch (error: any) {
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
     * Get Permission detais of the role
     */
    public async GetRolePermissions(roleId: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            const roleRolePermisssions = await RoleRolePermission.findAll({
                where: {
                    roleId: roleId,
                },
                row: true
            })

            let permissions = [];
            for (const element of roleRolePermisssions) {
                permissions.push(
                    await RolePermission.findOne({
                        where: {
                            id: element.rolePermissionId
                        }
                    })
                )
            }
            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = { permissions: permissions }
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
                    name: dtoRecord.name
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

            //create entry for only RoleRolePermission
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

                    const roleRolePermission = await RoleRolePermission.destroy({
                        where: {
                            roleId: role.id,
                            rolePermissionId: rolePermissionId,
                        }
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
            roleDto.name = dtoRecord.name;
            roleDto.description = dtoRecord.description;
            roleDto.roleType = dtoRecord.roleType;
            roleDto.updatedAt = recordModifiedInfo.updatedAt;
            roleDto.updatedById = recordModifiedInfo.updatedById;

            let updatedRecord = await Role.update(roleDto, {
                where: {
                    id: id
                }
            })

            if (updatedRecord !== undefined || updatedRecord !== null) {

                const resp = await this.UpdateRolePermission(dtoRecord.rolePermissionIds, id);

                if(!resp){
                    return undefined;
                }
               
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
     * Update Permissions associated with Role
     * @param rolePermissions 
     * @param roleId 
     * @returns 
     */
    public async UpdateRolePermission(rolePermissions: number[], roleId: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        console.log(rolePermissions)
        try {
            let resp = await RoleRolePermission.destroy({
                where: {
                    roleId: roleId,
                },
            })

            if (resp === undefined || resp === null) {
                return undefined
            }
            else {
                const recordCreatedInfo = this.SetRecordCreatedInfo({
                    createdAt: new Date(),
                    createdById: 0,
                });
                const recordModifiedInfo = this.SetRecordModifiedInfo({
                    updatedAt: new Date(),
                    updatedById: 0,
                });

                let list: any[] = [];

                for (const element of rolePermissions) {
                    list.push({
                        roleId: roleId,
                        rolePermissionId: element,
                        createdAt: recordCreatedInfo.createdAt,
                        createdById: recordCreatedInfo.createdById,
                        updatedAt: recordModifiedInfo.updatedAt,
                        updatedById: recordModifiedInfo.updatedById,
                        disabled: false,
                        enabledDisabledOn: new Date(),
                    })
                }
                //Bulk Create
                resp = await RoleRolePermission.bulkCreate(list, { fields: ['roleId', 'rolePermissionId', 'createdAt', 'updatedAt', 'createdById', 'updatedById', 'disabled', 'enabledDisabledOn'] });

                // console.log(resp)
                if (resp === undefined || resp === null) {
                    return undefined
                }

                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = { status: '200', message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
                return apiResponse;

            }
        }
        catch (error: any) {
            throw error;
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
            const roleRolePermissions = await RoleRolePermission.destroy({
                where: {
                    roleId: id,
                }
            });

            // //No entry in roleRolePermission is found, then continue; else remove all those entries
            // if (roleRolePermissions.length !== 0) {

            //     for (const element of roleRolePermissions) {
            //         let rolePermission = element

            //         const resp = await RoleRolePermission.destroy({
            //             where: {
            //                 id: rolePermission.id,
            //             },
            //             cascade: true,
            //         })

            //         if (resp === undefined || resp === null) {
            //             apiResponse = new ApiResponseDto()
            //             apiResponse.status = 0;
            //             let errorDto = new ErrorDto();
            //             errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
            //             errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
            //             apiResponse.error = errorDto;
            //             return apiResponse;
            //         }

            //     }

            // }

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

