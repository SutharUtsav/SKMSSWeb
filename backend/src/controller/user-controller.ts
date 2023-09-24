import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { EnumRoleType, EnumRoleTypeName } from "../consts/enumRoleType";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { UserDto, UserProfileDto } from "../dtos/user-dto";
import { RemoveFile } from "../helper/file-handling";
import { createTable } from "../helper/stagingTable";
import { validateBulkEntries, validateFamily, validateUser, validateUserProfile } from "../helper/validationCheck";
import { authMiddleware } from "../middleware/auth-middleware";
import { BaseService } from "../service/base-service";
import { IRoleService, RoleService } from "../service/role-service";
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
        const date = new Date();
        cb(null, `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${date.getTime()}`)
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
    try {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.getWorksheet('Sheet1');
        
        const roleService: IRoleService = new RoleService();
        let response = await roleService.GetIdByRoleType(EnumRoleTypeName[EnumRoleType.CustomRole]);

        if (!response || response?.status === 0) {
            res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                status: 0,
                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
            })
        }
        else {
            const roleId = response?.data.id;
            let userDtos: Array<UserDto> = [];
            let familyDtos: Array<FamilyDto> = [];
            let userProfileDtos: Array<UserProfileDto> = [];

            

            const baseService = new BaseService();
            await worksheet.eachRow((row: any, rowNumber: number) => {
                // rowNumber starts with 1
                if (rowNumber !== 1) {
                    let { userDto, userProfileDto, familyDto } = validateBulkEntries(row.values);
                    userDto.roleId = roleId;

                    baseService.SetRecordCreatedInfo(userDto)
                    baseService.SetRecordCreatedInfo(userProfileDto)
                    baseService.SetRecordCreatedInfo(familyDto)

                    baseService.SetRecordModifiedInfo(userDto)
                    baseService.SetRecordModifiedInfo(userProfileDto)
                    baseService.SetRecordModifiedInfo(familyDto)

                    userDtos.push(userDto);
                    userProfileDtos.push(userProfileDto);

                    if (!familyDtos.some((family: FamilyDto) => family.surname === familyDto.surname && family.village === familyDto.village && family.currResidency === familyDto.currResidency && family.mainFamilyMemberName === familyDto.mainFamilyMemberName)) {
                        familyDtos.push(familyDto);
                    }
                }
            })

            // console.log("FamilyDtos:", familyDtos)
            // console.log("UserDtos:", userDtos)
            // console.log("UserProfileDtos:", userProfileDtos)

            
            const userService: IUserService = new UserService();
            response = await userService.BulkInsert(userDtos, userProfileDtos, familyDtos);

            if (!response) {
                RemoveFile(req.file.path);
                res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                    status: 0,
                    message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
                })
            }
            else {
                if(response.status === 0){
                    RemoveFile(req.file.path);
                }
                res.status(200).send(response)
            }



        }
    }
    catch (err: any) {
        let apiResponse = new ApiResponseDto();
        let errorDto = new ErrorDto();
        errorDto.errorCode = '404';
        errorDto.errorMsg = err.toString();
        apiResponse.status = 0;
        apiResponse.error = errorDto;
        res.status(404).send(apiResponse)
    }



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