//#region Event Detail Dto

import { commonFieldsArr } from "../model/modelBase";
import { BaseDtoWithCommonFields } from "./base-dto";

export class EventDto extends BaseDtoWithCommonFields{
    title!:string | null;
    description!:string | null;
    eventOn!:Date | null;
    isActivity!:boolean | null;
    activityCategory!:string | null;
    mainImageURL!:string | null;
    // imageURLs!:string[] | null;
}

export class EventImageDto extends BaseDtoWithCommonFields{
    eventId!:string;
    imageURL!: string | null;
    isCoverImage!:boolean;
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

export const EventImageFieldsArr = [...commonFieldsArr, 'eventId', 'imageURL', 'isCoverImage']