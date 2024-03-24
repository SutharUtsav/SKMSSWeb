
//#region  Base interface for all entity

/**
 * Base interface for all Entity in Database.
 * Common name for PK for all table.
 */
export interface IModelBase {
    /**
     * Primary Key
     */
    id: number;
}

//#region  Interface to support recording record last updated information.
/**
 * Entity recording record last updated information.
 */
export interface IRecordModifiedInfo {
    /**
     * Record Last Modified On DateTime information.
     */
    updatedAt: Date;

    /**
     * Record last modified by UserId
     */
    updatedById: number
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
    createdAt: Date;

    /**
     *  Record created by UserId
     */
    createdById: number
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
    rowVersion: Uint8Array
}
//#endregion



//#region  Base DTO for all Object having PK
/**
 * Base class/model for all DTO for domain entity.
 * DTO object are used to transfer data to any client. It can have
 * properties which are relevant for specific use case.
 */
export class BaseDto implements IModelBase {
    /**
     * Primary Key
    */
    id!: number;

}
//#endregion

//#region  Base DTO for one time creation type entities.

/**
 * Base class for all entity where we don't need to record last modified information. 
 * e.g. One time creation and not required row version as update is not applicable or automatic.
 * Use it as base class as required for associated Entity for CURD operation.
 */
class BaseDtoWithCreatedInfoFields extends BaseDto implements IRecordCreatedInfo {
    /**
     * Record created on DateTime.
     */
    createdAt!: Date;

    /**
     * Record created by UserId.
     */
    createdById!: number;
}

//#endregion

//#region  Base DTO for most of the entity which support CURD operations!

export class BaseDtoWithCommonFields extends BaseDtoWithCreatedInfoFields implements IRowVersion, IRecordModifiedInfo {

    updatedAt!: Date;
    updatedById!: number;
    rowVersion!: Uint8Array;
    
}

//#endregion