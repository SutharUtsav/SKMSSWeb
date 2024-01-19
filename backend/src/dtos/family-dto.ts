import { commonFieldsArr } from "../model/modelBase";
import { BaseDto, BaseDtoWithCommonFields } from "./base-dto";

//#region Family Detail Dto

export class FamilyDto extends BaseDtoWithCommonFields{
    surname!:string | null;
    village!:string | null;
    currResidency!:string | null;
    adobeOfGod!:string | null;
    goddess!:string | null;
    lineage!:string | null;
    residencyAddress!:string | null;
    villageGuj!:string | null;
    mainFamilyMemberName!:string | null;
}


export class FamilyLookupDto{
    surname!:string | null;
    village!:string | null;
    villageGuj!:string | null;
    mainFamilyMemberName!:string | null;

    todos = (e : FamilyLookupDto) =>{
        
        e.surname = this.surname;
        e.village = this.village;
        e.mainFamilyMemberName = this.mainFamilyMemberName;
    }
}
//#endregion

export const familyFieldsArr = [...commonFieldsArr, 'surname', 'village', 'currResidency', 'adobeOfGod', 'goddess', 'lineage', 'residencyAddress', 'villageGuj', 'mainFamilyMemberName']