import { DataTypes } from "sequelize";
import { ModelBaseWithCommonFields } from "./modelBase";

const sequelize = require('../config/db')

export const Person = sequelize.define('Person', {
    
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
    surname: {
        type: DataTypes.STRING,
        allowNull: false
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
    city:{
        type: DataTypes.STRING,
        allowNull: false
    },
    /**
     * Current Residency
     */
    currResidency: {
        type: DataTypes.STRING,
        allowNull: false
    },
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
     * Common Fields
     */
    ...ModelBaseWithCommonFields
})