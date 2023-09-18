export enum EnumUserStatus{
    /**
     * Admin Created an User
     */
    ADMINCREATED = 0,
}

export const EnumUserStatusText : Record <EnumUserStatus,string> = {
    [EnumUserStatus.ADMINCREATED] : "ADMINCREATED"
}