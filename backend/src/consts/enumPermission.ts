export enum EnumPermission {
    //#region Standard Permissions
    /**
     * Specifies No rights.
     */
    None = 0x00000000,
    /**
     * Specifies View/Read access. e.g. Allow to view record or information.
     */
    ViewAccess = 0x00000001,
    /**
     * pecifies Update access. e.g. Allow to Update existing record/information.
     */
    UpdateAccess = 0x00000002,
    /**
     * Specifies View and Update access e.g. Allow to Update or view existing records.
     */
    ViewUpdateAccess = 0x00000003,
    /**
     * Specifies Create access. e.g. Allow to create new records.
     */
    CreateAccess = 0x00000004,
    /**
     * Specifies Create and View access. e.g. Allow to view and Create record.
     */
    ViewCreateAccess = 0x00000005,
    /**
     * Specifies the right to create, update and view a record.
     */
    ViewUpdateCreateAccess = 0x00000007,
    /**
     * Specifies the right to delete records.
     */
    DeleteAccess = 0x00000008,
    /**
     * Specifies Create,update,read/view, delete rights.
     */
    CRUDAccess = 0x0000000F,
    /**
     * Specifies Approve access for that entity.
     */
    ApproveAccess = 0x00000010,
    //#endregion
}

export const EnumPermissionName : Record<EnumPermission, string> = {
    [EnumPermission.None] : "None",
    [EnumPermission.ViewAccess] : "ViewAccess",
    [EnumPermission.UpdateAccess] :"UpdateAccess",
    [EnumPermission.ViewUpdateAccess] : "ViewUpdateAccess",
    [EnumPermission.CreateAccess] : "CreateAccess",
    [EnumPermission.ViewCreateAccess] : "ViewCreateAccess",
    [EnumPermission.ViewUpdateCreateAccess] : "ViewUpdateCreateAccess",
    [EnumPermission.DeleteAccess] : "DeleteAccess",
    [EnumPermission.CRUDAccess] : "CRUDAccess",
    [EnumPermission.ApproveAccess] : "ApproveAccess"
}