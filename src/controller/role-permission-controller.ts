import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto } from "../dtos/role-dto";
import { validateRolePermission } from "../helper/validationCheck";
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
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
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
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    let permissionDto: PermissionDto | ErrorDto | undefined = validateRolePermission(req.body);

    if (!permissionDto || !id) {
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
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
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

module.exports = router