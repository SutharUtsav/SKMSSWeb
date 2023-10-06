import { EnumPermission } from "../consts/enumPermission";
import { EnumPermissionFor } from "../consts/enumPermissionFor";
import { EnumRoleType } from "../consts/enumRoleType";
import { BaseDto, BaseDtoWithCommonFields } from "./base-dto";

//#region Role entity related dto
export class RoleDto extends BaseDtoWithCommonFields {
    name!: string;
    description!: string;
    roleType!: string;
    permissionIds!: RoleRolePermissionLookupDto[];
    rolePermissionIds !: number[];

    todos = (e: RoleDto) => {
        this.id = e.id;
        this.name = e.name;
        this.description = e.description;
        this.roleType = e.roleType;
        this.rolePermissionIds = e.rolePermissionIds;
        this.createdAt = e.createdAt;
        this.createdById = e.createdById;
        this.updatedAt = e.updatedAt;
        this.updatedById = e.updatedById;
    }
}
//#endregion

//#region Dto for any lookup of role
export class RoleLookUpDto extends BaseDto {
    name!: string;
    roleType!: EnumRoleType;

    todos = (e: RoleLookUpDto) => {
        this.id = e.id;
        this.name = e.name;
        this.roleType = e.roleType;
    }
}
//#endregion

//#region Role Permission Dto model

/**
 * Dto for Role permission.
 * Permission Information for each actual storage Entity or any virtual section or department.
 */

export class PermissionDto extends BaseDtoWithCommonFields {
    /**
     * Indicate to what permission apply to. e.g. Specific storage entity or virtual department in application.
     */
    permissionFor!: string;
    /**
     * Define actual allowed Permissions for associated entity.
     */
    permissions!: string;

    /**
     * Select expression to be used to populate Dto directly from Database
     */
    todos = (e: PermissionDto) => {
        this.id = e.id;
        this.permissionFor = e.permissionFor;
        this.permissions = e.permissions;
    }
}

export class PermissionListDto extends BaseDtoWithCommonFields {
    /**
     * Indicate to what permission apply to. e.g. Specific storage entity or virtual department in application.
     */
    permissionFor!: string;
    /**
     * Define actual allowed Permissions for associated entity.
     */
    permissions!: string;

    todos = (e: PermissionDto) => {
        this.id = e.id;
        this.permissionFor = e.permissionFor;
        this.permissions = e.permissions;
        this.createdAt = e.createdAt;
        this.createdById = e.createdById;
        this.updatedAt = e.updatedAt;
        this.updatedById = e.updatedById;
    }
}


/**
 * Lookup Dto for Role permission.
 */
export class RoleRolePermissionLookupDto {
    roleId!: number;
    permissionId!: number
}
//#endregion