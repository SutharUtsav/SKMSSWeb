import { IModelBase, IRecordCreatedInfo, IRecordModifiedInfo } from "../dtos/base-dto";

export class BaseService {

    /**
     * set common fields for create.
     * @param record 
     * @returns 
     */
    SetRecordCreatedInfo(record : any) : IRecordCreatedInfo {
        let recordCreatedInfo : IRecordCreatedInfo  = record as IRecordCreatedInfo;
        if(recordCreatedInfo){
            recordCreatedInfo.createdAt = new Date();
            recordCreatedInfo.createdById = 1;
        }
        return recordCreatedInfo;
    }

    /**
     * set common fields for update/create.
     * Update the last modified information if model implement IRecordModifiedInfo interface.
     * @param record 
     * @returns 
     */
    SetRecordModifiedInfo(record: any) : IRecordModifiedInfo {
        let recordModifiedInfo : IRecordModifiedInfo = record as IRecordModifiedInfo;
        if(recordModifiedInfo){
            recordModifiedInfo.updatedAt = new Date();
            recordModifiedInfo.updatedById = 1;
        }
        return recordModifiedInfo;
    }
}