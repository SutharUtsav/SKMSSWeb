import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumUserStatus } from "../consts/enumUserStatus";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { areAllFieldsFilled } from "../helper/heper";
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
    const userService: IUserService = new UserService();
    const response = await userService.GetRecordById(id);

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
 * Add User Detail
 */
router.post('/', async (req: any, res: any) => {
    let userDto: UserProfileDto | ErrorDto | undefined = validateUser(req.body);

    console.log(userDto)
    if (!userDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userDto instanceof ErrorDto) {
        res.status(parseInt(userDto.errorCode)).send(userDto);
    }
    else {
        const userService: IUserService = new UserService();
        // const response = await userService.Create(userDto);
        const response = {};

        if (!response) {
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
            })
        }
        else if (response instanceof ApiResponseDto) {
            res.send(response)
        }
        res.send(response)

    }
});

//#endregion


//#region ValidationCheck Function

const validateUser = (body: UserProfileDto): UserProfileDto | ErrorDto | undefined => {
    let userDto: UserProfileDto = new UserProfileDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        //check all requeried fields
        if (!body.username || !body.name || !body.surname || !body.wifeSurname || !body.city || !body.currResidency || !body.marriedStatus || !body.birthDate || !body.weddingDate || !body.education || !body.occupation || !body.mobileNumber || !body.email || !body.isImageAvailable || !body.roleId) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        if (EnumUserStatus[body.userType as keyof typeof EnumUserStatus] === undefined) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        //validate mobile number
        const regexMobile = /^[7-9]\d{9}$/;
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
        if (!regexMobile.test(body.mobileNumber) || !regexEmail.test(body.email)) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        //set fields of UserDto
        userDto.username = body.username;
        userDto.name = body.name;
        userDto.surname = body.surname;
        userDto.wifeSurname = body.wifeSurname;
        userDto.city = body.city;
        userDto.currResidency = body.currResidency;
        userDto.marriedStatus = body.marriedStatus;
        userDto.birthDate = body.birthDate;
        userDto.weddingDate = body.weddingDate;
        userDto.education = body.education;
        userDto.occupation = body.occupation;
        userDto.mobileNumber = body.mobileNumber;
        userDto.email = body.email;
        userDto.isImageAvailable = body.isImageAvailable;
        userDto.roleId = body.roleId;

    }

    return userDto;
}
//#endregion


module.exports = router