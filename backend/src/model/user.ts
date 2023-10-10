import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const User = sequelize.define('User',{
    name : {
        type : DataTypes.STRING
    },
    userType : {
        type : DataTypes.STRING
    },
    isImageAvailable : {
        type : DataTypes.BOOLEAN
    },
    surname : {
        type : DataTypes.STRING
    },
    village: {
        type : DataTypes.STRING
    },
    ...ModelBaseWithCommonFields
},{tableName : 'User'})

