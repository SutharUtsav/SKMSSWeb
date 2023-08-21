import { Role, RolePermission, RoleRolePermission } from "./role"
import { User } from "./user";

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

    Role.hasMany(User,{
        foreignKey : 'id',
        as : 'UserRoleId'
    })
    User.belongsTo(Role,{
        foreignKey : 'roleId'
    })
}