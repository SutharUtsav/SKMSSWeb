import { Role, RolePermission, RoleRolePermission } from "./role"

export const dbContext = () => {

    Role.hasMany(RoleRolePermission, {
        foreignKey : 'id',
        as : 'roleRolePermission'
    });
    RoleRolePermission.belongsTo(Role, {
        foreignKey : 'roleId',
    });

    RolePermission.hasMany(RoleRolePermission,{
        foreignKey : 'id',
        as : 'roleRolePermission'
    });
    RoleRolePermission.belongsTo(RolePermission,{
        foreignKey : 'rolePermissionId'
    });
    
}