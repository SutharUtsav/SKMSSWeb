export const RolePermissionEntity = {
    DASHBOARD: {
        name  : "Dashboard",
        permissions: {
            MANAGEDASHBOARD :"Manage Dashboard"
        }
    },
    USER : {
        name : "User",
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