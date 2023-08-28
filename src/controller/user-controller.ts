import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { validateUser, validateUserProfile } from "../helper/validationCheck";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();



//#region CRUD operation on User Entity

/**
 * Get All Records of Role
 */
router.get('/', async (req: any, res: any) => {
    const userService: IUserService = new UserService();
    const response = await userService.GetRecords();

    if (!response) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
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
    const userService: IUserService = new UserService();
    const response = await userService.GetRecordById(id);

    if (!response) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        res.send(response)
    }
})

/**
 * Add User Detail
 */
router.post('/', async (req: any, res: any) => {
    console.log(req.body)
    let userDto: UserDto | ErrorDto | undefined = validateUser(req.body);
    let userProfileDto: UserProfileDto | ErrorDto | undefined = validateUserProfile(req.body);

    if (!userDto || !userProfileDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userDto instanceof ErrorDto) {
        res.status(parseInt(userDto.errorCode)).send(userDto);
    }
    else if (userProfileDto instanceof ErrorDto) {
        res.status(parseInt(userProfileDto.errorCode)).send(userProfileDto);
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.Create(userDto, userProfileDto);

        if (!response) {
            res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                status: 0,
                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
            })
        }
        else if (response instanceof ApiResponseDto) {
            res.send(response)
        }

    }
});

/**
 * Update User Detail
 */
router.put('/', async (req: any, res: any) => {
    const id = req.query.id;
    let userDto: UserDto | ErrorDto | undefined = validateUser(req.body);
    if (!userDto || !id) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userDto instanceof ErrorDto) {
        res.status(parseInt(userDto.errorCode)).send(userDto);
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.Update(userDto, id);

        if (!response) {
            res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                status: 0,
                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
            })
        }
        else {
            res.send(response)
        }
    }
})

router.delete('/', async (req: any, res: any) => {
    const id = req.query.id;

    const userService: IUserService = new UserService();
    const response = await userService.Remove(id);

    if (!response) {
        res.status(EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        res.send(response)
    }
})

//#endregion




module.exports = {router}