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
})