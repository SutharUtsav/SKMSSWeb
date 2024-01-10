import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const Family = sequelize.define('Family', {
    surname: {
        type: DataTypes.TEXT,
        unique: 'compositeKey'
    },
    village: {
        type: DataTypes.TEXT,
        unique: 'compositeKey'
    },
    villageGuj: {
        type: DataTypes.TEXT,
        unique: 'compositeKey'
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
    mainFamilyMemberName: {
        type: DataTypes.TEXT,
        unique: 'compositeKey'
    },
    ...ModelBaseWithCommonFields
}, {
    tableName: 'Family',
    indexes: [
        {
            unique: true,
            fields: ['surname', 'village', 'villageGuj', 'mainFamilyMemberName'],
            name: 'Family_compositeKey' // Example index for uniqueness
        }
    ]
})