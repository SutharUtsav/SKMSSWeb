import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
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
    
    await fs.readFile(path.join('VastiPatrak/templates', 'Template.html'), 'utf8', async (err: any, data: any) => {
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
router.get('/pdf', async (req: any, res:any)=>{
    
})



module.exports = router