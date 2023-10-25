import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { FamilyDto } from "../dtos/family-dto";
import { validateFamily } from "../helper/validationCheck";
import { FamilyService, IFamilyService } from "../service/family-service";

const express = require('express');
const router = express.Router();


//#region CRUD operation on Family Entity

/**
 * Get All Records of Family
 */
router.get('/', async (req: any, res: any) => {
    const familyService: IFamilyService = new FamilyService();
    const response = await familyService.GetRecords();

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
 * Get All Lookup Records of Family
 */
router.get('/look-up', async (req: any, res: any) => {
    const familyService: IFamilyService = new FamilyService();
    const response = await familyService.GetRecords(true);

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
    const familyService: IFamilyService = new FamilyService();
    const response = await familyService.GetRecords(true, id);

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
* Get Record of Family Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    const familyService: IFamilyService = new FamilyService();
    const response = await familyService.GetRecordById(id);

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
 * Add Family Detail
 */
router.post('/', upload, async (req: any, res: any) => {
    let familyDto: FamilyDto | ErrorDto | undefined = validateFamily(req.body);


    if (!familyDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if(familyDto instanceof ErrorDto){
        res.status(parseInt(familyDto.errorCode)).send(familyDto);
    }
    else {
        const familyService: IFamilyService = new FamilyService();
        const response = await familyService.Create(familyDto);

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
 * Update Family Detail
 */
router.put('/', upload, async (req: any, res: any) => {
    const id = req.query.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }

    let familyDto: FamilyDto | ErrorDto | undefined = validateFamily(req.body);
    if (!familyDto || !id) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if (familyDto instanceof ErrorDto) {
        res.status(parseInt(familyDto.errorCode)).send(familyDto);
    }
    else {
        const familyService: IFamilyService = new FamilyService();
        const response = await familyService.Update(familyDto, id);

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
 * remove Family Entity by id
 */
router.delete('/', async (req: any, res: any) => {
    const id = req.query.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{
        const familyService: IFamilyService = new FamilyService();
        const response = await familyService.Remove(id);
    
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

module.exports = router;