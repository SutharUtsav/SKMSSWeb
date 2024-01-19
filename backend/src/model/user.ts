import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields, commonFieldsArr } from "./modelBase"

const sequelize = require('../config/db')

export const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    userType: {
        type: DataTypes.STRING
    },
    isImageAvailable: {
        type: DataTypes.BOOLEAN
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    village: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    ...ModelBaseWithCommonFields
}, {
    tableName: 'User',
    indexes: [
        {
            unique: true,
            fields: ['name', 'surname', 'village'],
            name: 'User_compositeKey' // Example index for uniqueness
        }
    ]
})


export const userFieldsArr = [...commonFieldsArr, 'name', 'userType', 'isImageAvailable', 'roleId','surname', 'village', ];