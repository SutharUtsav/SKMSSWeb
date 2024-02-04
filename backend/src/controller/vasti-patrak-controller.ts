import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ReadFilesFromDirectory } from "../helper/file-handling";
import { IVastiPatrakService, VastiPatrakService } from "../service/vasti-patrak-service";

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * Add VastiPatrak Template
 */
router.post('/add-template', async (req: any, res: any) => {

})

/**
 * Get VastiPatrak Tempate
 */
router.get('/get-template', async (req: any, res: any) => {
    const vastiPatrakService: IVastiPatrakService = new VastiPatrakService();
    const response = await vastiPatrakService.GetTempates();

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
 * Get VastiPatrak Data
 */
router.get('/', async (req: any, res: any) => {
    const vastiPatrakService: IVastiPatrakService = new VastiPatrakService();
    const response = await vastiPatrakService.GetRecords();

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
 * Generate VastiPatrak
 */
router.get('/generate', async (req: any, res: any) => {

    const templateFileName = req.query.templateFileName;

    await fs.readFile(path.join('VastiPatrak/templates', templateFileName), 'utf8', async (err: any, data: any) => {
        if (err) {
            console.error(err);
            res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                status: 0,
                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
            })
            return;
        }
        const vastiPatrakService: IVastiPatrakService = new VastiPatrakService();
        const response = await vastiPatrakService.GenerateVastiPatrak(data);


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


})

/**
 * Get VastiPatrak PDF
 */
router.get('/get-pdf', async (req: any, res: any) => {
    path.join('VastiPatrak/pdfs', 'VastiPatrak.pdf');
    res.download(path.join('VastiPatrak/pdfs', 'VastiPatrak.pdf')); 
})



module.exports = router