import { EnumErrorMsg } from "../consts/enumErrors";


/**
 * Check required field of Object are filled or not
 * @param obj Object whose fields should be checked
 * @param allowNullFields Allowed null fields
 * @returns true if all required fields are filled; else false
 */
export const areAllFieldsFilled = <T>(obj: T, allowNullFields: Record<keyof T, boolean> | undefined = undefined): boolean => {
    if(typeof obj as Object && Object.keys(obj as Object).length === 0){
        return false;
    }
    for(const key in obj){
        if(allowNullFields){
            if(!allowNullFields[key] && ( obj[key] === null || obj[key] === undefined ||  (typeof obj[key] === 'string' && String(obj[key]).trim() === ''))){
                return false;
            }
        }
        else{
            if( obj[key] === null || obj[key] === undefined ||  (typeof obj[key] === 'string' && String(obj[key]).trim() === '')){
                return false;
            }
        }
    }
    return true;
}


const lodash = require('lodash')
/**
 * Validate Permission 
 * @param permissions 
 * @param permissionFor 
 * @param permission 
 * @returns return true if permission found else returns false
 */
export const validatePermissions = (permissions: any, permissionFor: string, permission: string): boolean => {
    return ( lodash.compact(permissions).filter( (localPermission: any)=> localPermission.permissionFor === permissionFor && localPermission.permissions === permission).length > 0 )
}