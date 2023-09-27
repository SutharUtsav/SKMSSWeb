export const RolePermissionEntity = {
    DASHBOARD: {
        name  : "DASHBOARD",
        permissions: {
            MANAGEDASHBOARD :"Manage Dashboard"
        }
    },
    USER : {
        name : "USER",
        permissions : {
            LISTACCESS : "User List", 
            UPDATEACCESS : "User Update", 
            DELETEACCESS : "User Delete"
        }
    },
    FAMILY : {
        name : "Family",
        permissions : {
            LISTACCESS : "Family List", 
            UPDATEACCESS :"Family Update", 
            DELETEACCESS :"Family Detete"
        }
    }
}