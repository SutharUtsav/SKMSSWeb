import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { regexEmail, regexMobile } from "../helper/validationCheck";
import { AuthService } from "../service/auth-service";

const express = require('express');
const router = express.Router();

//#region Handle Authentication Apis

/**
 * Authenticate community member with Email
 * 
 */
router.post('/auth-member', upload, async (req:any, res:any)=>{
    const email = req.body.email;
    const password = req.body.password;

    if(!password || !email || !regexEmail.test(email)){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{
        const authService = new AuthService();
        const response = await authService.AuthCommunityMember(email,password);

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
 * Authenticate with Mobile NUmber
 */
router.post('/mobile-auth', upload, async (req:any, res:any) => {

    const mobileNumber = req.body.mobileNumber;
    
    if(!mobileNumber || !regexMobile.test(mobileNumber)){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else{

        const authService = new AuthService();
        const response = await authService.LoginWithMobile(mobileNumber);

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