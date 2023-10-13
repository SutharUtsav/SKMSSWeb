import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const User = sequelize.define('User',{
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    userType : {
        type : DataTypes.STRING
    },
    isImageAvailable : {
        type : DataTypes.BOOLEAN
    },
    surname : {
        type : DataTypes.STRING,
        allowNull : false
    },
    village: {
        type : DataTypes.STRING,
        allowNull : false
    },
    ...ModelBaseWithCommonFields
},{tableName : 'User'})

