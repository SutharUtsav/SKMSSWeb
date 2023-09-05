import { DataTypes } from "sequelize";


//#region  Base Model/class Definitions

/**
 *  Base class for Entity with common fields
 */
export const ModelBaseWithCommonFields = {
    /**
     *  Primary Key
    */
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
    },
    /**
     * Record Modified On DateTime. For newly created record it will be same as created on.
     */
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },

    /**
     * Record Modified by UserId.
     */
    updatedById: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    /**
    * Record created DateTime information.
    */
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },

    /**
     *  Record created by UserId
     */
    createdById: {
        type:DataTypes.NUMBER,
        allowNull: false,
    },
    /**
     * Indicate that record is disable. e.g. Not allowed to update or uses
     */
    disabled: {
        type:DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    /**
     * DateTime when record was last Disabled or Enable again!
     */
    enabledDisabledOn: {
        type:DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false
    },

    /**
     * Record row version to support concurrency update for each record!
     */
    rowVersion: {
        type: DataTypes.BLOB,
        // allowNull: false,
    }
}

//#endregion
