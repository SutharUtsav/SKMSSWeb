import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { regexMobile } from "../helper/validationCheck";
import { AuthService } from "../service/auth-service";

const express = require('express');
const router = express.Router();

//#region Handle Authentication Apis

router.post('/', async (req:any, res:any) => {

    const mobileNumber = req.body.mobileNumber;
    
    if(!mobileNumber || !regexMobile.test(mobileNumber)){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{

        const authService = new AuthService();
        const response = await authService.Login(mobileNumber);

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