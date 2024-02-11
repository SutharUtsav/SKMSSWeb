import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const SamajwadiOccupied = sequelize.define('SamajWadiOccupied', {
    fromDate: {
        type: DataTypes.DATE,
    },
    toDate: {
        type: DataTypes.DATE,
    },
    isOccupied: {
        type: DataTypes.BOOLEAN,
    },
    eventTitle: {
        type: DataTypes.TEXT
    },
    eventDescription: {
        type: DataTypes.TEXT
    },
    fair: {
        type: DataTypes.DOUBLE
    },
    totalDays: {
        type: DataTypes.DECIMAL
    },
    ...ModelBaseWithCommonFields
}, {
    tableName: 'SamajWadiOccupied',
})