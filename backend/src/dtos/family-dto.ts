import { BaseDtoWithCommonFields } from "./base-dto";

//#region Family Detail Dto

export class FamilyDto extends BaseDtoWithCommonFields{
    surname!:string;
    village!:string;
    currResidency!:string;
    adobeOfGod!:string;
    goddess!:string;
    lineage!:string;
    residencyAddress!:string;
    villageGuj!:string;
    mainFamilyMemberName!:string;
}

//#endregion