import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { EventDto, EventImageDto } from "../dtos/event-dto";
import { validateEvent, validateEventImages } from "../helper/validationCheck";
import { EventService, IEventService } from "../service/event-service";

const express = require('express');
const router = express.Router();


//#region CRUD operation on Event Entity

/**
 * Get All Records of Event
 */
router.get('/', async (req: any, res: any) => {
    const eventService: IEventService = new EventService();
    const response = await eventService.GetRecords();

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
 * Get All Lookup Records of Event
 */
router.get('/look-up', async (req: any, res: any) => {
    const eventService: IEventService = new EventService();
    const response = await eventService.GetRecords(true);

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
    const eventService: IEventService = new EventService();
    const response = await eventService.GetRecords(true, id);

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
* Get Record of Event Entity by Id
*/
router.get('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    if(id===undefined || id===null){
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    const eventService: IEventService = new EventService();
    const response = await eventService.GetRecordById(id);

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
 * Add Event Detail
 */
router.post('/', upload, async (req: any, res: any) => {
    console.log("In controller");
    let eventDto: EventDto | ErrorDto | undefined = validateEvent(req.body);
    let eventImageDtos : EventImageDto[] | ErrorDto | undefined = validateEventImages(req.body);

    console.log("EventDto :", eventDto)
    console.log("EventImageDtos :", eventImageDtos)

    if (!eventDto || !eventImageDtos) {
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    }
    else if(eventDto instanceof ErrorDto){
        res.status(parseInt(eventDto.errorCode)).send(eventDto);
    }
    else if(eventImageDtos instanceof ErrorDto){
        res.status(parseInt(eventImageDtos.errorCode)).send(eventImageDtos);
    }
    else {
        const eventService: IEventService = new EventService();
        const response = await eventService.Create(eventDto, eventImageDtos);

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
 * Update Event Detail
 */
router.put('/', upload, async (req: any, res: any) => {
    // const id = req.query.id;
    // if(id===undefined || id===null){
    //     res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
    //         status: 0,
    //         message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
    //     })
    // }

    // let familyDto: FamilyDto | ErrorDto | undefined = validateFamily(req.body);
    // if (!familyDto || !id) {
    //     res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
    // }
    // else if (familyDto instanceof ErrorDto) {
    //     res.status(parseInt(familyDto.errorCode)).send(familyDto);
    // }
    // else {
    //     const familyService: IFamilyService = new FamilyService();
    //     const response = await familyService.Update(familyDto, id);

    //     if (!response) {
    //         res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
    //             status: 0,
    //             message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
    //         })
    //     }
    //     else {
    //         res.send(response)
    //     }
    // }
})

/**
 * remove Event Entity by id
 */
router.delete('/', async (req: any, res: any) => {
    // const id = req.query.id;
    // if(id===undefined || id===null){
    //     res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
    //         status: 0,
    //         message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
    //     })
    // }
    // else{
    //     const familyService: IFamilyService = new FamilyService();
    //     const response = await familyService.Remove(id);
    
    //     if (!response) {
    //         res.status(EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
    //             status: 0,
    //             message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
    //         })
    //     }
    //     else {
    //         res.send(response)
    //     }
    // }
})

//#endregion

module.exports = router;