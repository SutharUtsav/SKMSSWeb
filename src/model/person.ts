import { DataTypes } from "sequelize";
import { ModelBaseWithCommonFields } from "./modelBase";

const sequelize = require('../config/db')

export const Person = sequelize.define('People', {
    /**
     * Person's name
     */
    name1: DataTypes.STRING,
    /**
     * Person's Surname
     */
    surname: DataTypes.STRING,
//     /**
//    * Person's ID
//    */
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     default: true
//   },
    // ...ModelBaseWithCommonFields
})