import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumPermission, EnumPermissionName } from "../consts/enumPermission";
import { EnumPermissionFor, EnumPermissionForName } from "../consts/enumPermissionFor";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto } from "../dtos/role-dto";
import { areAllFieldsFilled } from "../helper/heper";
import { IRolePermissionService, RolePermissionService } from "../service/role-permission-service";

const express = require('express');
const router = express.Router();

//#region CRUD operation on RolePermission Entity

/**
 * Get All Entities of RolePermission
 */
router.get('/', async (req: any, res: any) => {
    const rolePermissionService: IRolePermissionService = new RolePermissionService();
    const response = await rolePermissionService.GetRecords();

    if (!response) {
        res.status(400).send({
            status: 0,
            message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
        })
    }
    else {
        res.send(response)
    }
})

/**
* Get Record of RolePErmission Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    const rolePermissionService: IRolePermissionService = new RolePermissionService();
    const response = await rolePermissionService.GetRecordById(id);

    if (!response) {
        res.status(400).send({
            status: 0,
            message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
        })
    }
    else {
        res.send(response)
    }
})

/**
 * Add RolePermission Detail
 */
router.post('/', async (req: any, res: any) => {
    let permissionDto: PermissionDto | ErrorDto | undefined = validateRolePermission(req.body);

    if (!permissionDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (permissionDto instanceof ErrorDto) {
        res.status(parseInt(permissionDto.errorCode)).send(permissionDto);
    }
    else {
        const rolePermissionService: IRolePermissionService = new RolePermissionService();
        const response = await rolePermissionService.Create(permissionDto);
        if (!response) {
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
            })
        }
        if (response instanceof ApiResponseDto) {
            res.send(response)
        }
    }
});

/**
 * Update RolePermission Detail
 */
router.put('/', async (req: any, res: any) => {
    const id = req.query.id;

    let permissionDto: PermissionDto | ErrorDto | undefined = validateRolePermission(req.body);

    if (!permissionDto) {
        res.send(EnumErrorMsg.API_SOMETHING_WENT_WRONG);
    }
    else if (permissionDto instanceof ErrorDto) {
        res.status(parseInt(permissionDto.errorCode)).send(permissionDto);
    }
    else {
        const rolePermissionService: IRolePermissionService = new RolePermissionService();
        const response = await rolePermissionService.Update(permissionDto, id);

        if (!response) {
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
            })
        }
        if (response instanceof ApiResponseDto) {
            res.send(response)
        }
    }
})

/**
 * Delete RolePermission Detail
 */
router.delete('/', async (req: any, res: any) => {
    const id = req.query.id;

    const rolePermissionService: IRolePermissionService = new RolePermissionService();
    const response = await rolePermissionService.Remove(id);

    if (!response) {
        res.status(404).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        res.send(response)
    }

})

//#endregion


//#region ValidationCheck Function
const validateRolePermission = (body: PermissionDto): PermissionDto | ErrorDto | undefined => {
    let permissionDto: PermissionDto = new PermissionDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        //set permissionFor field
        if (EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            permissionDto.permissionFor = EnumPermissionForName[EnumPermissionFor[body.permissionFor as keyof typeof EnumPermissionFor]];
        }

        //set permissions field
        if (EnumPermission[body.permissions as keyof typeof EnumPermission] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            permissionDto.permissions = EnumPermissionName[EnumPermission[body.permissions as keyof typeof EnumPermission]];
        }
    }
    return permissionDto;
}
//#endregion

module.exports = router