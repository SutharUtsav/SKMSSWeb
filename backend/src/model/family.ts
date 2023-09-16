import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const Family = sequelize.define('Family', {
    surname: {
        type: DataTypes.TEXT
    },
    village: {
        type: DataTypes.TEXT
    },
    villageGuj: {
        type: DataTypes.TEXT
    },
    currResidency: {
        type: DataTypes.TEXT
    },
    adobeOfGod: {
        type: DataTypes.STRING
    },
    goddess: {
        type: DataTypes.STRING
    },
    lineage: {
        type: DataTypes.STRING
    },
    residencyAddress: {
        type: DataTypes.TEXT
    },
    ...ModelBaseWithCommonFields
}, { tableName: 'Family' })