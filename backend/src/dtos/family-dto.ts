import { BaseDtoWithCommonFields } from "./base-dto";

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

//#endregion