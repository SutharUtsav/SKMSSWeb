
//#region Social Worker Dto

import { BaseDtoWithCommonFields } from "./base-dto";

export class SocialWorkerDto extends BaseDtoWithCommonFields{
    position!:string | null;
    name!:string | null;
    surname!:string | null;
    village!:string | null;
    image!:string | null;
}

//#endregion