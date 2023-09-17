import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { validateFamily, validateUser, validateUserProfile } from "../helper/validationCheck";
import { authMiddleware } from "../middleware/auth-middleware";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();



//#region Specific operations

/**
 * Find User's Id by User's Details
 */
router.get('/findid', async (req: any, res: any)=> {
    console.log("FindId")
    const name = req.query.name;
    const surname = req.query.surname;
    const village = req.query.village;

    if( name===undefined || name===null || surname===undefined || surname===null || village===undefined || village===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{
        const userService: IUserService = new UserService();
        const response = await userService.findUserIdByDetails(name, surname, village);
    
        if (!response) {
            res.status(EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                status: 0,
                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
            })
        }
        else {
            res.send(response)
        } 
    }
})

//#endregion


//#region CRUD operation on User Entity

/**
 * Get All Records of User
 */
router.get('/' , async (req: any, res: any) => {
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
* Get Record of User Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
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
//authMiddleware
router.post('/', upload,async (req: any, res: any) => {
    let userDto: UserDto | ErrorDto | undefined = validateUser(req.body);
    let userProfileDto: UserProfileDto | ErrorDto | undefined = validateUserProfile(req.body);
    let familyDto: FamilyDto | ErrorDto | undefined = validateFamily(req.body);


    if (!userDto || !userProfileDto || !familyDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userDto instanceof ErrorDto) {
        res.status(parseInt(userDto.errorCode)).send(userDto);
    }
    else if (userProfileDto instanceof ErrorDto) {
        res.status(parseInt(userProfileDto.errorCode)).send(userProfileDto);
    }
    else if(familyDto instanceof ErrorDto){
        res.status(parseInt(familyDto.errorCode)).send(familyDto);
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.Create(userDto, userProfileDto, familyDto);

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
router.put('/', upload, async (req: any, res: any) => {
    const id = req.query.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }

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
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{
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
    }
})

//#endregion



module.exports = router