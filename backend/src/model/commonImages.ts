import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const CommonImages = sequelize.define('CommonImages', {
    imageURL: {
        type: DataTypes.TEXT,
    },
    category:  {
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
}, {
    tableName: 'CommonImages',
})