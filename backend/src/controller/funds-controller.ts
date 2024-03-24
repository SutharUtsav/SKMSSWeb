import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { FundsService, IFundsService } from "../service/funds-service";

const express = require('express');
const router = express.Router();


//#region CRUD operation on Funds Entity

/**
 * Get All Records of Funds and their Donor
 */
router.get('/donor', async (req: any, res: any) => {
    const donorService: IFundsService = new FundsService();
    const response = await donorService.GetRecords(false,false);

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
 * Get Record of Funds and Donor by donorId
 */
router.get('/donor/:id', async (req:any, res:any)=>{
    const id = req.params.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const donorService: IFundsService = new FundsService();
        const response = await donorService.GetRecords(false,false, id);

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
 * Get Funds details
 */
router.get('/', async (req: any, res: any) => {
    const donorService: IFundsService = new FundsService();
    const response = await donorService.GetRecords(true);

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
 * Add Donor and Funds detail
 */
router.post('/', upload, async (req:any, res:any) => {
    
})

/**
 * Update Donor and Funds detail
 */
router.put('/', upload, async(req:any, res:any) => {
    const id = req.query.id;

})

// /**
//  * Delete Funds Details
//  */
// router.delete('/', async (req:any, res:any) => {
//     const id = req.query.id;
    
// })
//#endregion


module.exports = router;