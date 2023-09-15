import { DataTypes } from "sequelize"
import { ModelBaseWithCommonFields } from "./modelBase"
const sequelize = require('../config/db')

export const UserProfile = sequelize.define('UserProfile', {
    /**
     * Person's name
     */
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Person's Surname
     */
    // surname: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    /**
     * Surname of Person's Wife  
     */
    wifeSurname: {
        type: DataTypes.STRING,
    },
    /**
     * City/Village
     */
    // city:{
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
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
        allowNull: false
    },
    /**
     * Person's BirthDate
     */
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    /**
     * Person's Wedding Date
     */
    weddingDate: DataTypes.DATE,
    /**
     * Person's Highest Education 
     */
    education: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Person's Occupation
     */
    occupation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Person's Mobile Number
     */
    mobileNumber: {
        type: DataTypes.STRING,
        validate: {
            is: /^[0-9]{10}$/i,
        },
        allowNull: false

    },
    /**
     * Country Code of Person's mobile number
     */
    countryCode : {
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Person's email address
     */
    email :{
        type : DataTypes.STRING,
    },
    /**
     * Person's gender
     */
    gender :{
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
    mainFamilyMemberRelation :{
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
    fatherId :{
        type: DataTypes.BIGINT
    },
    /**
     * Father's Name
     */
    fatherName: { 
        type: DataTypes.TEXT
    },
    /**
     * Common Fields
     */
    ...ModelBaseWithCommonFields
},{tableName : 'UserProfile'})


export const UserProfileImage = sequelize.define('UserProfileImage', {
    /**
     * Image Url of User Profile
     */
    image : {
        type : DataTypes.STRING,
        allowNull: false
    },
    ...ModelBaseWithCommonFields
},{tableName : 'UserProfileImage'})