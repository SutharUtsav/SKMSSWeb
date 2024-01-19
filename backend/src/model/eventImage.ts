import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const EventImages = sequelize.define('EventImages', {
    imageURL: {
        type: DataTypes.TEXT
    },
    isCoverImage: {
        type: DataTypes.BOOLEAN
    },
    ...ModelBaseWithCommonFields
}, { tableName: 'EventImages' })