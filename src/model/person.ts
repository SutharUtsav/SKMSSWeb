import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { ModelBaseWithCommonFields } from "./modelBase";



export const Person = sequelize.define('Person',{
    /**
     * Person's name
     */
    name : DataTypes.STRING,
    /**
     * Person's Surname
     */
    surname: DataTypes.STRING,
    ...ModelBaseWithCommonFields
})