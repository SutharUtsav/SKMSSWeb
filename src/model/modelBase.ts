//#region  Common Interfaces

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

//#region  Base model for all entity

/**
 * Base class for all Entity of a Domain.
 */
class ModelBase implements IModelBase {
 /**
 * Primary Key
 */
    Id!: number;
}

//#endregion

//#region  Base model for one time creation type entities.

/**
 *  Base class for all entity where we don't need to record created information. 
 * e.g. One time creation and not required row version as update is not applicable or automatic.

 */
class ModelBaseWithCreatedInfoFields extends ModelBase implements IRecordCreatedInfo {
    /**
 * Record created DateTime information.
 */
    CreatedOn!: Date;

    /**
     *  Record created by UserId
     */
    CreatedById!: number
}

//#endregion

//#region  Base model for most of the entity which support CURD operations!

/**
 *  Base class for Entity with common fields
 */
export class ModelBaseWithCommonFields extends ModelBaseWithCreatedInfoFields implements IRecordModifiedInfo, IRowVersion {
    /**
     * Record Modified On DateTime. For newly created record it will be same as created on.
     */
    ModifiedOn!: Date;

    /**
     * Record Modified by UserId.
     */
    ModifiedById?: number

    /**
     * Indicate that record is disable. e.g. Not allowed to update or uses
     */
    Disabled!: boolean

    /**
     * DateTime when record was last Disabled or Enable again!
     */
    EnabledDisabledOn!: Date

    /**
     * Record row version to support concurrency update for each record!
     */
    RowVersion!: Uint8Array
}

    //#endregion


//#endregion
