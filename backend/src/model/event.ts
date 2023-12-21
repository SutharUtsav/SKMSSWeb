import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const Events = sequelize.define('Events', {
    title: {
        type: DataTypes.TEXT
    },
    description: {
        type: DataTypes.TEXT
    },
    eventOn: {
        type: DataTypes.DATE
    },
    isActivity: {
        type: DataTypes.BOOLEAN
    },
    activityCategory: {
        type: DataTypes.STRING
    },
    ...ModelBaseWithCommonFields
}, { tableName: 'Events' })