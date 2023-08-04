import { ModelBaseWithCommonFields } from "./modelBase";

export class Person extends ModelBaseWithCommonFields{
    /**
     * Person's Name
     */
    name!: string;

    /**
     * Person's Surname
     */
    surname!:string;
}
