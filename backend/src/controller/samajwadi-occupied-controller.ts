import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SamajWadiOccupiedDto } from "../dtos/samajwadi-occpied-dto";
import { validateSamajwadiOccupied } from "../helper/validationCheck";
import { ISamajwadiOccupiedService, SamajwadiOccupiedService } from "../service/samajwadi-occupied-service";

const express = require('express');
const router = express.Router();

//#region CRUD operation on SamajWadi Occupied Entity

/**
 * Get SamajWadiOccupied Details
 */
router.get("/", async (req: any, res: any) => {
    const month : number = req.query.month;
    const year : number = req.query.year;

    if (!month || !year) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        const samajwadiOccupiedService: ISamajwadiOccupiedService = new SamajwadiOccupiedService();
        const response = await samajwadiOccupiedService.GetRecordsByMonth(month, year, false);

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
 * Get SamajWadiOccupied Lookup Details
 */
router.get("/look-up", async (req: any, res: any) => {
    const month : number = req.query.month;
    const year : number = req.query.year;

    if (!month || !year) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        const samajwadiOccupiedService: ISamajwadiOccupiedService = new SamajwadiOccupiedService();
        const response = await samajwadiOccupiedService.GetRecordsByMonth(month, year, true);

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
 * Add SamajwadiOccupied Detail
 */
router.post("/", upload, async (req:any, res:any) => {
    console.log("in controller")
    let samajwadiOccupiedDto: SamajWadiOccupiedDto | ErrorDto | undefined = validateSamajwadiOccupied(req.body);


    if (!samajwadiOccupiedDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if(samajwadiOccupiedDto instanceof ErrorDto){
        res.status(parseInt(samajwadiOccupiedDto.errorCode)).send(samajwadiOccupiedDto);
    }
    else {
        const samajwadiOccupiedService: ISamajwadiOccupiedService = new SamajwadiOccupiedService();
        const response = await samajwadiOccupiedService.Create(samajwadiOccupiedDto);

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
})


/**
 * remove SamajwadiOccupied Entity by id
 */
router.delete("/", async (req:any, res:any) => {
    const id = req.query.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{
        const samajwadiOccupiedService: ISamajwadiOccupiedService = new SamajwadiOccupiedService();
        const response = await samajwadiOccupiedService.Remove(id);
    
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