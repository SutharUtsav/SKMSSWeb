import { DataTypes } from "sequelize";


//#region  Base interface for all entity

/**
 * Base interface for all Entity in Database.
 * Common name for PK for all table.
 */
export interface IModelBase {
    /**
     * Primary Key
     */
    Id: number;
}


//#endregion

//#region  Interface to support recording record last updated information.
/**
 * Entity recording record last updated information.
 */
export interface IRecordModifiedInfo {
    /**
     * Record Last Modified On DateTime information.
     */
    ModifiedOn: Date;

    /**
     * Record last modified by UserId
     */
    ModifiedById?: number
}
//#endregion


//#region  Interface to support recording record creation information.

/**
 * Entity recording record created information.
 */
export interface IRecordCreatedInfo {
    /**
     * Record created DateTime information.
     */
    CreatedOn: Date;

    /**
     *  Record created by UserId
     */
    CreatedById: number
}

//#endregion

/**
 * Interface to implement concurrency check.
 * i.e. during update if record is modified by other user, application should not update the record and throw
 * error back!
 */
export interface IRowVersion {
    /**
     * RowVersion information.
     */
    RowVersion: Uint8Array
}
//#endregion

//#region  Base Model/class Definitions

/**
 *  Base class for Entity with common fields
 */

export const ModelBaseWithCommonFields = {
    /**
     *  Primary Key
    */
    Id: DataTypes.NUMBER,
    /**
     * Record Modified On DateTime. For newly created record it will be same as created on.
     */
    ModifiedOn: DataTypes.DATE,

    /**
     * Record Modified by UserId.
     */
    ModifiedById: DataTypes.NUMBER,
    /**
    * Record created DateTime information.
    */
    CreatedOn: DataTypes.DATE,

    /**
     *  Record created by UserId
     */
    CreatedById: DataTypes.NUMBER,
    /**
     * Indicate that record is disable. e.g. Not allowed to update or uses
     */
    Disabled: DataTypes.BOOLEAN,

    /**
     * DateTime when record was last Disabled or Enable again!
     */
    EnabledDisabledOn: DataTypes.DATE,

    /**
     * Record row version to support concurrency update for each record!
     */
    RowVersion: DataTypes.BLOB
}

//#endregion
