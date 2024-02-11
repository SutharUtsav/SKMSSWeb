import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SocialWorkerDto } from "../dtos/social-worker-dto";
import { validateSocialWorker } from "../helper/validationCheck";
import { ISocialWorkerService, SocialWorkerService } from "../service/social-worker-service";

const express = require('express');
const router = express.Router();


//#region CRUD operation on Social Worker Entity


/**
 * Get SocialWorker Details
 */
router.get("/", async (req: any, res: any) => {
    const socialWorkerService: ISocialWorkerService = new SocialWorkerService();
    const response = await socialWorkerService.GetRecords();

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
 * Add Social Worker Detail
 */
router.post('/', upload, async (req: any, res: any) => {
    let socialWorkerDto: SocialWorkerDto | ErrorDto | undefined = validateSocialWorker(req.body);


    if (!socialWorkerDto) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if(socialWorkerDto instanceof ErrorDto){
        res.status(parseInt(socialWorkerDto.errorCode)).send(socialWorkerDto);
    }
    else {
        const socialWorkerService: ISocialWorkerService = new SocialWorkerService();
        const response = await socialWorkerService.Create(socialWorkerDto);

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
});


//#endregion

module.exports = router;