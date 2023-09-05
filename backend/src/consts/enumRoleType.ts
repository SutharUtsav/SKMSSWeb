export enum EnumRoleType {
    /**
     * Custom role. Allowed permission are as per rights selection of that role.
     */
    CustomRole = 0,
    /**
     * Global Administrator role. Has access to everything.
     */
    GlobalAdministator = 1,
}

export const EnumRoleTypeName : Record<EnumRoleType , string> = {
    [EnumRoleType.CustomRole] : "CustomRole",
    [EnumRoleType.GlobalAdministator]: "GlobalAdministator"
}