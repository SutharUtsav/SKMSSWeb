import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumUserStatus } from "../consts/enumUserStatus";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { areAllFieldsFilled } from "../helper/heper";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();

//#region Specfic Event on User Entity

router.put('/user-profile', async (req: any, res: any) => {
    const id = req.query.id;
    let userProfileDto: UserProfileDto | ErrorDto | undefined = validateUserProfile(req.body);

    if ( !userProfileDto || !id) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userProfileDto instanceof ErrorDto) {
        res.status(parseInt(userProfileDto.errorCode)).send(userProfileDto);
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.UpdateUserProfile(userProfileDto,id);

        if (!response) {
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
            })
        }
        else  {
            res.send(response)
        }
    }
})

//#endregion

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
    let userDto: UserDto | ErrorDto | undefined = validateUser(req.body);
    let userProfileDto : UserProfileDto | ErrorDto | undefined = validateUserProfile(req.body);

    console.log(userProfileDto)
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
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
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
            res.status(400).send({
                status: 0,
                message: EnumErrorMsg.API_SOMETHING_WENT_WRONG
            })
        }
        else {
            res.send(response)
        }
    }
})

router.delete('/', async (req:any, res : any) => {
    const id = req.query.id;

    const userService: IUserService = new UserService();
    const response = await userService.Remove(id);

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

const validateUser = (body: UserDto): UserDto | ErrorDto | undefined => {
    let userDto: UserDto = new UserDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        //check all required fields
        if (!body.username || !body.isImageAvailable || !body.roleId) {
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

        //set fields of UserDto
        userDto.username = body.username;
        userDto.userType = body.userType;
        userDto.isImageAvailable = body.isImageAvailable;
        userDto.roleId = body.roleId;

    }

    return userDto;
}

const validateUserProfile = (body : UserProfileDto) : UserProfileDto | ErrorDto | undefined => {
    let userDto: UserProfileDto = new UserProfileDto();

    if (!areAllFieldsFilled(body)) {
        return undefined;
    }
    else {
        if ( !body.name || !body.surname || !body.wifeSurname || !body.city || !body.currResidency || !body.marriedStatus || !body.birthDate || !body.weddingDate || !body.education || !body.occupation || !body.countryCode || !body.mobileNumber || !body.email ) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        //validate mobile number
        const regexMobile = /^[7-9]\d{9}$/;
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
        if (!regexMobile.test(body.mobileNumber) || !regexEmail.test(body.email) ) {
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }

        if(new Date(body.birthDate).toString() === "Invalid Date" || new Date(body.weddingDate).toString() === "Invalid Date"){
            let errorDto = new ErrorDto();
            errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST].toString();
            errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
            return errorDto;
        }
        
        //set fields of UserDto
        userDto.name = body.name;
        userDto.surname = body.surname;
        userDto.wifeSurname = body.wifeSurname;
        userDto.city = body.city;
        userDto.currResidency = body.currResidency;
        userDto.marriedStatus = body.marriedStatus;
        userDto.birthDate = new Date(body.birthDate);
        userDto.weddingDate = new Date(body.weddingDate);
        userDto.education = body.education;
        userDto.occupation = body.occupation;
        userDto.mobileNumber = body.mobileNumber;
        userDto.countryCode = body.countryCode;
        userDto.email = body.email;
    }
    return userDto;
}
//#endregion


module.exports = router