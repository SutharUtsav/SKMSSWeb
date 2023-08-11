import { BaseDtoWithCommonFields } from "./base-dto";


//#region Person entity related dto
export class PersonDto extends BaseDtoWithCommonFields{
    name!: string;
    surname!:string;
    wifeSurname!:string;
    city!:string;
    currResidency!:string;
    marriedStatus!:string;
    birthDate!:Date;
    weddingDate!:Date;
    education!:string;
    occupation!:string;
    mobileNumber!:string;
}
//#endregion