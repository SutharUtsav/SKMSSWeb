import { ModelBaseWithCommonFields } from "./modelBase"
import { DataTypes } from "sequelize";

const sequelize = require('../config/db')

export const Role = sequelize.define('Role',{
    /**
     * Role Name
     */
    name : {
        type : DataTypes.STRING,
        allowNull: false,
    },
    /**
     * Role Description
     */
    description :{
        type : DataTypes.STRING,
        allowNull: false,
    },
    /**
     * Role Type (CustomRole, GlobalAdministator)
     */
    roleType :{
        type : DataTypes.STRING,
        allowNull: false,
    },

    // rolePermissionId : {
    //     type : DataTypes.BIGINT,
    //     allowNull: false
    // },
    
    ...ModelBaseWithCommonFields
},{tableName : 'Role'})


export const RolePermission = sequelize.define('RolePermission',{
    /**
     * Entity for which Permission is associated
     */
    permissionFor : {
        type: DataTypes.STRING,
        allowNull : false,
    },
    /**
     * Permissions associated with Roles
     */
    permissions : {
        // type : sequelize.Array(DataTypes.BLOB),
        type : DataTypes.STRING,
        allowNull: false,
    },
    
    ...ModelBaseWithCommonFields   
}, {tableName : 'RolePermission'})


export const RoleRolePermission = sequelize.define('RoleRolePermission', {
    // /**
    //  * Role Id
    //  * Foreign key associated with Role Table 
    //  */
    // roleId : DataTypes.BIGINT,
    // /**
    //  * Role Permission Id
    //  * Foreign key associated with RolePermission Table 
    //  */
    // rolePermissionId :DataTypes.BIGINT

    ...ModelBaseWithCommonFields
}, {tableName : 'RoleRolePermission'})