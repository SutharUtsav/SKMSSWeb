//#region Event Detail Dto

import { BaseDtoWithCommonFields } from "./base-dto";

export class EventDto extends BaseDtoWithCommonFields{
    title!:string | null;
    description!:string | null;
    eventOn!:Date | null;
    isActivity!:boolean | null;
    activityCategory!:string | null;
}

//#endregion