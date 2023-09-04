import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const User = sequelize.define('User',{
    username : {
        type : DataTypes.STRING
    },
    userType : {
        type : DataTypes.STRING
    },
    isImageAvailable : {
        type : DataTypes.BOOLEAN
    },
    ...ModelBaseWithCommonFields
},{tableName : 'User'})


export const UserRefreshToken = sequelize.define('UserRefreshToken',{
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
    },
    /**
     * Refresh Token
     */
    refreshToken: {
        type: DataTypes.STRING
    },
    /**
     * Expiration Date of Refresh Token
     */
    validTill: {
        type: DataTypes.DATE
    },
    /**
    * Record created DateTime information.
    */
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    /**
     *  Record created by UserId
     */
    createdById: {
        type:DataTypes.NUMBER,
        allowNull: false,
    },

})