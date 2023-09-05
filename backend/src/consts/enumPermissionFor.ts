export enum EnumPermissionFor {
    USER = 0,
    EVENT = 1,
}

export const EnumPermissionForName : Record<EnumPermissionFor , string> = {
    [EnumPermissionFor.USER] : "User",
    [EnumPermissionFor.EVENT] :"Event"
}