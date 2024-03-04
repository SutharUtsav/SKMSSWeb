
//#region Common Images Dto

import { BaseDtoWithCommonFields } from "./base-dto";

export class CommonImagesDto extends BaseDtoWithCommonFields{
    category!:string | null;
    imageURL!:string | null;
}

//#endregion