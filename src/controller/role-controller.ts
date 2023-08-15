import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumPermission, EnumPermissionName } from "../consts/enumPermission";
import { EnumPermissionFor, EnumPermissionForName } from "../consts/enumPermissionFor";
import { EnumRoleType, EnumRoleTypeName } from "../consts/enumRoleType";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { areAllFieldsFilled } from "../helper/heper";
import { IRolePermissionService, IRoleService, RolePermissionService, RoleService } from "../service/role-service";

const express = require('express');
const router = express.Router();

//#region CRUD operation on Role Entity

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

//#endregion

//#region CRUD operation on RolePermission Entity

/**
 * Get All Entities of RolePermission
 */
router.get('/role-permission', async (req: any, res: any) => {
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
 * Add RolePermission Detail
 */
router.post('/role-permission', async (req: any, res: any) => {
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
router.put('/role-permission', async (req: any, res: any) => {
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
router.delete('/role-permission', async (req: any, res: any) => {
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


const validateRole = (body: RoleDto): RoleDto | ErrorDto | undefined => {
    let roleDto: RoleDto = new RoleDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {

        //set fields of RoleDto
        roleDto.name = body.name;
        roleDto.description = body.description;
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