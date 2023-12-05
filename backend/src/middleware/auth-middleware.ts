import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { PermissionDto, RoleDto } from "../dtos/role-dto";
import { Role, RolePermission, RoleRolePermission } from "../model/role";

var jwt = require('jsonwebtoken');


export const authMiddleware = async (req: any, res: any,next:any) => {
    const token: string = req.headers['authorization'];

    if (!token) {
        return res.status(EnumErrorMsgCode[EnumErrorMsg.API_UNAUTHORIZED]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_UNAUTHORIZED]
        });
    }

    try {
        const decodedToken = jwt.verify(token.replace('Bearer ',''), process.env['JWT_SECRET']);

        const roleName: string =decodedToken.role;

        let role: RoleDto = await Role.findOne({
            where: {
                name: roleName
            },
            attributes: ['id']
        })

        if(role){
            let permissionIds: any = await RoleRolePermission.findAll({
                where: {
                    roleId: role.id
                },
                raw: true,
                attributes: ['rolePermissionId']
            })

            let permissions: any = [];
            if (permissionIds && permissionIds.length > 0) {

                if(permissionIds.length == 1){
                    const permission: PermissionDto = await RolePermission.findOne({
                        where: {
                            id: permissionIds.rolePermissionId
                        },
                        attributes: ['permissionFor', 'permissions']
                    });

                    if (permission) {
                        permissions.push({permissionFor: permission.permissionFor, permissions: permission.permissions});
                    }
                }
                else{
                    for (const permissionId of permissionIds) {
                        const permission: PermissionDto = await RolePermission.findOne({
                            where: {
                                id: permissionId.rolePermissionId
                            },
                            attributes: ['permissionFor', 'permissions']
                        });

                        if (permission) {
                            permissions.push({permissionFor: permission.permissionFor, permissions: permission.permissions});
                        }
                    }
                }
            }

            req.permissions = permissions
            next()
        }
        else{
            throw "";
        }

        // next()
       
    } catch (error) {
        return res.status(EnumErrorMsgCode[EnumErrorMsg.API_UNAUTHORIZED]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_UNAUTHORIZED]
        });
    }

}

