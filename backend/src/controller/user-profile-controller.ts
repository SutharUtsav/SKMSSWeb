import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { UserProfileDto, UserProfileImageDto } from "../dtos/user-dto";
import { RemoveFilesFromDirectory } from "../helper/file-handling";
import { validateUserProfile } from "../helper/validationCheck";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs')

//#region specific Event on UserProfile Entity

/**
 * Update UserProfile Details based on userId
 */
router.put('/', upload, async (req: any, res: any) => {
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

/**
 * Get UserProfile Lookup Details 
 */
router.get('/look-up', async (req: any, res: any) => {
    const userService: IUserService = new UserService();
    const response = await userService.GetUserProfiles(true);

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

router.get('/look-up/:id', async (req: any, res: any) => {
    const id = req.params.id;
    const userService: IUserService = new UserService();
    const response = await userService.GetUserProfiles(true, id);

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

//#endregion


//#region Specific Event on UserProfileImage Entity


// Multer setup for image upload
const profilePictureStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const outputDir = 'Images/Profile';

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        cb(null, outputDir)
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    limits: { fileSize: "10000000" }, //10 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const fileTypes = /jpeg|png|jpg|JPG|JPEG|PNG|webp/
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
router.post('/upload-image', uploadProfilePicture, async (req: any, res: any) => {
    const id = req.query.userId;



    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const imageURL = req.file.path;

        const outputDir = 'Images/Profile-Webp';
        const outputFile = Date.now() + '.webp';

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFilePath = path.join(outputDir, outputFile);

        sharp(imageURL)
            .rotate()
            .webp({ quality: 60 }) // convert to webp format
            .toFile(outputFilePath)
            .then(async (data: any) => {
                const body: UserProfileImageDto = req.body;
                body.image = outputFile;
                body.originalImage = imageURL;
                if (!body) {
                    await RemoveFilesFromDirectory(process.cwd() +'/Images/Profile');
                    res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
                }
                else {
                    const userService: IUserService = new UserService();
                    const response = await userService.UploadUserProfileImage(id, body);

                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Profile');
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
            .catch(async (error: any) => {
                await RemoveFilesFromDirectory(process.cwd() +'/Images/Profile');
                res.status(400).send({
                    status: 0,
                    message: String(error)
                })
            })
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

router.delete('/remove-image', async (req: any, res: any) => {
    const id = req.query.userId;

    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const userService: IUserService = new UserService();
        const response = await userService.RemoveUserProfileImage(id);

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