import { IModelBase, IRecordCreatedInfo, IRecordModifiedInfo, IRowVersion } from "../model/modelBase";

//#region  Base DTO for all Object having PK
/**
 * Base class/model for all DTO for domain entity.
 * DTO object are used to transfer data to any client. It can have
 * properties which are relevant for specific use case.
 */
class BaseDto implements IModelBase {
    /**
     * Primary Key
    */
    Id!: number;

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
    CreatedOn!: Date;

    /**
     * Record created by UserId.
     */
    CreatedById!: number;
}

//#endregion

//#region  Base DTO for most of the entity which support CURD operations!

export class BaseDtoWithCommonFields extends BaseDtoWithCreatedInfoFields implements IRowVersion, IRecordModifiedInfo {

    ModifiedOn!: Date;
    ModifiedById!: number;
    RowVersion!: Uint8Array;
}

//#endregion