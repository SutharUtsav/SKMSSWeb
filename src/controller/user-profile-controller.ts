import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ErrorDto } from "../dtos/api-response-dto";
import { UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { validateUserProfile } from "../helper/validationCheck";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
//#region specific Event on UserProfile Entity

/**
 * Update UserProfile Details based on userId
 */
router.put('/', async (req: any, res: any) => {
    const id = req.query.userid;
    let userProfileDto: UserProfileDto | ErrorDto | undefined = validateUserProfile(req.body);

    if (!userProfileDto || id == undefined || id === null) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (userProfileDto instanceof ErrorDto) {
        res.status(parseInt(userProfileDto.errorCode)).send(userProfileDto);
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.UpdateUserProfile(userProfileDto, id);

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

/**
 * Get UserProfile Details based on userId
 */
router.get('/', async (req: any, res: any) => {
    const id = req.query.userId;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.GetUserProfile(id);

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
//#endregion


//#region Specific Event on UserProfileImage Entity


// Multer setup for image upload
const profilePictureStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'Images/Profile')
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage: profilePictureStorage,
    limits: { fileSize: "10000000" }, //10 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const fileTypes = /jpeg|png|jpg|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper file format to upload')
    }
}).single('image');



/**
 * Upload User Profile Image based on User's Image 
 */
router.post('/upload-image', upload, async (req: any, res: any) => {
    const id = req.query.userId;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const imageURL = req.file.path;

        const body: UserProfileImageDto = req.body;
        body.image = imageURL;
        if (!body) {
            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
        }
        else {
            const userService: IUserService = new UserService();
            const response = await userService.UploadUserProfileImage(id, body);

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
    }
})

/**
 * get user's profile picture
 */
router.get('/profile-image', async (req: any, res: any) => {
    const id = req.query.userId;

    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.GetUserProfileImage(id);

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
//#endregion


module.exports = router