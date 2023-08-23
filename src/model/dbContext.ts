import { Role, RolePermission, RoleRolePermission } from "./role"
import { User } from "./user";
import { UserProfile, UserProfileImage } from "./userProfile";

export const dbContext = () => {

    //One to Many relation between Role and RolePermission 
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

    //One to One relationship between Role and User 
    Role.hasMany(User,{
        foreignKey : 'id',
        as : 'UserRoleId'
    })
    User.belongsTo(Role,{
        foreignKey : 'roleId'
    })

    //One to One relationship between User and UserProfile 
    User.hasOne(UserProfile, { 
        foreignKey : 'id',
        as : 'UserProfileId'
    })
    UserProfile.belongsTo(User,{
        foreignKey : 'userId'
    })

    //One to One relationship between User and UserProfileImage 
    User.hasOne(UserProfileImage,{
        foreignKey : 'id',
        as : 'UserProfileImageId'
    })
    UserProfileImage.belongsTo(User,{
        foreignKey : 'userId'
    })
}