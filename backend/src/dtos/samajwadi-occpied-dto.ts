
//#region SamajWadi Occupied Dto

import { BaseDtoWithCommonFields } from "./base-dto";

export class SamajWadiOccupiedDto extends BaseDtoWithCommonFields{
    fromDate!:Date | null;
    toDate!:Date | null;
    isOccupied!:boolean;
    eventTitle!:string | null;
    eventDescription!: string | null;
    fair!:number;
    totalDays!: number;
}

//#endregion