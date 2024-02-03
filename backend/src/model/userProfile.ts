import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields, commonFieldsArr } from "./modelBase"
const sequelize = require('../config/db')

export const UserProfile = sequelize.define('UserProfile', {
    /**
     * Person's name
     */
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    /**
     * Person's Surname
     */
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    /**
     * Surname of Person's Wife  
     */
    wifeSurname: {
        type: DataTypes.STRING,
    },
    /**
     * City/Village
     */
    village: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeKey'
    },
    /**
     * Current Residency
     */
    // currResidency: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    /**
     * Person's Married Status
     */
    marriedStatus: {
        type: DataTypes.STRING,
    },
    /**
     * Person's BirthDate
     */
    birthDate: {
        type: DataTypes.STRING,
    },
    /**
     * Person's Wedding Date
     */
    weddingDate: DataTypes.STRING,
    /**
     * Person's Highest Education 
     */
    education: {
        type: DataTypes.STRING,
    },
    /**
     * Person's Occupation
     */
    occupation: {
        type: DataTypes.STRING,
    },
    /**
     * Person's Mobile Number
     */
    mobileNumber: {
        type: DataTypes.STRING,
        // validate: {
        //     is: /^[0-9]{10}$/i,
        // },
        allowNull: false

    },
    /**
     * Country Code of Person's mobile number
     */
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Person's email address
     */
    email: {
        type: DataTypes.STRING,
    },
    /**
     * Person's gender
     */
    gender: {
        type: DataTypes.STRING
    },
    /**
     * True if Person is main member of family else False
     */
    isMainFamilyMember: {
        type: DataTypes.BOOLEAN
    },
    /**
     * Id of Main Family Member
     */
    mainFamilyMemberId: {
        type: DataTypes.BIGINT
    },
    /**
     * Person's relation to Main Family Member
     */
    mainFamilyMemberRelation: {
        type: DataTypes.STRING
    },
    /**
     * Mother's Id
     */
    motherId: {
        type: DataTypes.BIGINT
    },
    /**
     * Mother's Name
     */
    motherName: {
        type: DataTypes.TEXT
    },
    /**
     * Father's Id
     */
    fatherId: {
        type: DataTypes.BIGINT
    },
    /**
     * Father's Name
     */
    fatherName: {
        type: DataTypes.TEXT
    },
    password: {
        type: DataTypes.STRING,
        require: true
    },
    /**
     * Common Fields
     */
    ...ModelBaseWithCommonFields
}, {
    tableName: 'UserProfile',
    indexes: [
        {
            unique: true,
            fields: ['name', 'surname', 'village'],
            name: 'UserProfile_compositeKey' // Example index for uniqueness
        }
    ]
})


export const UserProfileImage = sequelize.define('UserProfileImage', {
    /**
     * Image Url of User Profile
     */
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalImage: {
        type: DataTypes.STRING
    },
    ...ModelBaseWithCommonFields
}, { tableName: 'UserProfileImage' })


export const UserProfileFieldsArr = [...commonFieldsArr, 'userId', 'name', 'surname', 'wifeSurname', 'village', 'marriedStatus', 'education', 'occupation', 'mobileNumber', 'email', 'countryCode', 'familyId', 'gender', 'isMainFamilyMember', 'mainFamilyMemberId', 'mainFamilyMemberRelation', 'motherId', 'motherName', 'fatherId', 'fatherName', 'birthDate', 'weddingDate'];