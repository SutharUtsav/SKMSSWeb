import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { validateBulkEntries, validateFamily, validateUser, validateUserProfile } from "../helper/validationCheck";
import { authMiddleware } from "../middleware/auth-middleware";
import { IUserService, UserService } from "../service/user-service";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const exceljs = require('exceljs')

//#region Specific operations

/**
 * Find User's Id by User's Details
 */
router.get('/findid', async (req: any, res: any) => {
    console.log("FindId")
    const name = req.query.name;
    const surname = req.query.surname;
    const village = req.query.village;

    if (name === undefined || name === null || surname === undefined || surname === null || village === undefined || village === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
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



// Multer setup for excel sheet upload
const excelSheetStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const outputDir = `VastiPatrak/Data`;

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
const uploadExcelSheet = multer({
    storage: excelSheetStorage,
    limits: { fileSize: "10000000" }, //10 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const fileTypes = /excel|xls|xlsx|sheet/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper file format to upload')
    }
}).single('excelSheet');

/**
 * Bulk Insert of Users by excel sheet
 */
router.post('/bulkInsert', uploadExcelSheet, async (req: any, res: any) => {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet('Sheet1');

    // const userDtos : Array<UserDto> = [];
    worksheet.eachRow((row: any, rowNumber: number) => {
        if(rowNumber!==0){
            var { userDto, userProfileDto, familyDto } = validateBulkEntries(row.values);
            console.log(userDto);
            console.log(userProfileDto);
            console.log(familyDto)
        }
    })
    
    const data = worksheet.eachRow((row: any, rnumber: number) => {
        return {
            name: row[0],
            age: row[1]
        };
    })

    res.send({ data: data });
})

//#endregion


//#region CRUD operation on User Entity

/**
 * Get All Records of User
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
* Get Record of User Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    if (id === undefined || id === null) {
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
router.post('/', upload, async (req: any, res: any) => {
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
    else if (familyDto instanceof ErrorDto) {
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
    if (id === undefined || id === null) {
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
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
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