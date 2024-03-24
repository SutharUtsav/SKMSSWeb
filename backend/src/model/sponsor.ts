import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields, commonFieldsArr } from "./modelBase"

const sequelize = require('../config/db')

export const Sponsor = sequelize.define('Sponsor', {
    name: {
        type: DataTypes.TEXT,
    },
    email: {
        type: DataTypes.TEXT,
    },
    phone: {
        type: DataTypes.TEXT,
    },
    address: {
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
},{
    tableName: 'Sponsor',
})

export const sponsorAttributesList = ['id','name', 'email', 'phone', 'address', ...commonFieldsArr];
export const sponsorAttributesLookupList = ['id','name', 'email', 'phone', 'address'];


export const Sponsorship = sequelize.define('Sponsorship', {
    sponsorId: {
        type: DataTypes.BIGINT,
    },
    purpose: {
        type: DataTypes.TEXT,
    },
    amount: {
        type: DataTypes.DECIMAL,
    },
    adsAttachments: {
        type: DataTypes.TEXT,
    },
    startDate:{
        type: DataTypes.DATE,
    },
    endDate:{
        type: DataTypes.DATE,
    },
    paymentStatus: {
        type: DataTypes.TEXT,
    },
    ...ModelBaseWithCommonFields
},{
    tableName: 'Sponsorship',
})

export const sponsorshipAttributesList = ['sponsorId', 'purpose', 'amount', 'adsAttachments', 'startDate', 'endDate', 'paymentStatus', ...commonFieldsArr];
export const sponsorshipAttributesLookupList = ['id','sponsorId', 'purpose', 'amount', 'adsAttachments', 'startDate', 'endDate', 'paymentStatus'];
