import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumPermission, EnumPermissionName } from "../consts/enumPermission";
import { EnumPermissionFor, EnumPermissionForName } from "../consts/enumPermissionFor";
import { EnumRoleType, EnumRoleTypeName } from "../consts/enumRoleType";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { areAllFieldsFilled } from "../helper/heper";
import { IRoleService, RoleService } from "../service/role-service";

const express = require('express');
const router = express.Router();

//#region CRUD operation on Role Entity

/**
 * Get All Records of Role
 */
router.get('/', async (req: any, res: any) => {
    const roleService: IRoleService = new RoleService();
    const response = await roleService.GetRecords();

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
* Get Record of Role Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    const roleService: IRoleService = new RoleService();
    const response = await roleService.GetRecordById(id);

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
 * Add Role Detail
 */
router.post('/', async (req: any, res: any) => {
    let roleDto: RoleDto | ErrorDto | undefined = validateRole(req.body);

    if (!roleDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (roleDto instanceof ErrorDto) {
        res.status(parseInt(roleDto.errorCode)).send(roleDto);
    }
    else {
        const roleService: IRoleService = new RoleService();
        const response = await roleService.Create(roleDto);

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
 * Update Role Detail
 */
router.put('/', async (req: any, res: any) => {
    const id = req.query.id;

    let roleDto: RoleDto | ErrorDto | undefined = validateRole(req.body);

    if (!roleDto) {
        res.send(EnumErrorMsg.API_SOMETHING_WENT_WRONG);
    }
    else if (roleDto instanceof ErrorDto) {
        res.status(parseInt(roleDto.errorCode)).send(roleDto);
    }
    else {
        const roleService: IRoleService = new RoleService();
        const response = await roleService.Update(roleDto, id);

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
 * Delete Role Detail
 */
router.delete('/', async (req: any, res: any) => {
    const id = req.query.id;

    const roleService: IRoleService = new RoleService();
    const response = await roleService.Remove(id);

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

//#region specific API handling on Role Entity
/**
 * Get Permission Details of a Role
 */
router.get('/role-permission-by-role', async (req: any, res: any) => {
    const id = req.query.id;

    const roleService: IRoleService = new RoleService();
    const response = await roleService.GetRolePermissions(id);

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


router.put('/role-permission-by-role', async (req: any, res: any) => {
    const id = req.query.id;
    const body = req.body.permissions;

    const roleService: IRoleService = new RoleService();
    const response = await roleService.UpdateRolePermission(body, id);

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
//#endregion


//#region ValidationCheck Function

const validateRole = (body: RoleDto): RoleDto | ErrorDto | undefined => {
    let roleDto: RoleDto = new RoleDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {

        //set fields of RoleDto
        roleDto.name = body.name;
        roleDto.description = body.description;
        if (body.rolePermissionIds)
            roleDto.rolePermissionIds = body.rolePermissionIds;
        //set roleType Field
        if (EnumRoleType[body.roleType as keyof typeof EnumRoleType] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        else {
            roleDto.roleType = EnumRoleTypeName[EnumRoleType[body.roleType as keyof typeof EnumRoleType]];
        }
    }

    return roleDto;
}


//#endregion

module.exports = router