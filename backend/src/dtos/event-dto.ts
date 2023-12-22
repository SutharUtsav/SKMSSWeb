//#region Event Detail Dto

import { BaseDtoWithCommonFields } from "./base-dto";

export class EventDto extends BaseDtoWithCommonFields{
    title!:string | null;
    description!:string | null;
    eventOn!:Date | null;
    isActivity!:boolean | null;
    activityCategory!:string | null;
    mainImageURL!:string | null;
    imageURLs!:string[] | null;
}


export class EventLookupDto{
    title!:string | null;
    description!:string | null;
    eventOn!:Date | null;

    todos = (e : EventLookupDto) =>{
        
        e.title = this.title;
        e.description = this.description;
        e.eventOn = this.eventOn;
    }
}

//#endregion