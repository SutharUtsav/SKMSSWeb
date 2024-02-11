import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const SocialWorker = sequelize.define('SocialWorker', {
    position: {
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
}, {
    tableName: 'SocialWorker',
})