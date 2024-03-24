import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"

const sequelize = require('../config/db')

export const Funds = sequelize.define('Funds', {
    donorId: {
        type: DataTypes.BIGINT,
    },
    amount: {
        type: DataTypes.DECIMAL,
    },
    donationDate: {
        type: DataTypes.DATE,
    },
    purpose: {
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
},{
    tableName: 'Funds',
})


export const Donor = sequelize.define('Donor', {
    name: {
        type: DataTypes.TEXT,
    },
    communityMemberId: {
        type: DataTypes.BIGINT,
    },
    email: {
        type: DataTypes.TEXT,
    },
    phone: {
        type: DataTypes.TEXT,
    },
    address:{
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
},{
    tableName: 'Donor',
})