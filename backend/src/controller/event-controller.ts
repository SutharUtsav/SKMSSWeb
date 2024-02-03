import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { EventDto, EventImageDto } from "../dtos/event-dto";
import { RemoveFile, RemoveFilesFromDirectory } from "../helper/file-handling";
import { validateEvent, validateEventImages } from "../helper/validationCheck";
import { EventService, IEventService } from "../service/event-service";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const _ = require('lodash');



// Multer setup for event images upload 

const EventImagesStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const outputDir = `Images/Event`;

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        cb(null, outputDir)
    },
    filename: (req: any, file: any, cb: any) => {
        // console.log(file)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});


//#region CRUD operation on EventImage Entity

/**
 * Get All Records of EventImages
 */
router.get('/images', async (req: any, res: any) => {
    const eventId = req.query.eventId;

    if (!eventId) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
        })
    }
    else {
        const eventService: IEventService = new EventService();
        const response = await eventService.GetEventImages(eventId);

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
 * CDN for event image based on filePath
 */
router.get('/image/:fileName', async (req: any, res: any) => {
    try {
        // const filePath = req.query.path;

        const fileName = req.params.fileName;
        const filePath = path.join('Images/Event-Webp', fileName);


        console.log(filePath)
        if (fs.existsSync(filePath)) {
            console.log("File Exist")
            // Read the file and send it in the response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            let apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                status: 404,
                message: "File not found"
            }
            res.status(404).send(apiResponse);
        }
    }
    catch (error: any) {
        console.log(error);
        let apiResponse = new ApiResponseDto();
        apiResponse.status = 0;
        apiResponse.error = new ErrorDto();
        apiResponse.error.errorCode = "500";
        apiResponse.error.errorMsg = error
        res.status(500).send(error);
    }
})


const uploadEventImages = multer({
    storage: EventImagesStorage,
    limits: { fileSize: "5000000" }, //5 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const fileTypes = /png|jpg|jpeg|webp/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {

            return cb(null, true)
        }
        cb('Give proper file format to upload')
    }
}).any('imageURLs')

/**
 * Upload Images of Events
 */
router.post('/images', uploadEventImages, async (req: any, res: any) => {
    const eventId = req.query.eventId;

    if (eventId === undefined || eventId === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {

        const paths = _.map(req.files, 'path');
        // console.log(paths)
        const outputDir = 'Images/Event-Webp';

        convertToWebP(paths, outputDir)
            .then(async (outputFilePaths: any) => {
                console.log('Conversion completed successfully.');
                console.log(outputFilePaths)
                // await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');

                const eventImagesDto: EventImageDto[] | ErrorDto | undefined = validateEventImages(outputFilePaths);

                if (!eventImagesDto || eventImagesDto instanceof ErrorDto) {
                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                    outputFilePaths.forEach(async (outputFilePath: string) => {
                        await RemoveFile(outputFilePath);
                    })
                    res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
                }
                else {
                    const eventService: IEventService = new EventService();
                    const response = await eventService.UploadImages(eventImagesDto, eventId);

                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                    if (!response) {
                        outputFilePaths.forEach(async (outputFilePath: string) => {
                            await RemoveFile(outputFilePath);
                        })
                        res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                            status: 0,
                            message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
                        })
                    }
                    else if (response?.status === 0) {
                        await outputFilePaths.forEach(async (outputFilePath: string) => {
                            await RemoveFile(outputFilePath);
                        })
                    }
                    else if (response instanceof ApiResponseDto) {
                        res.send(response)
                    }

                }

            })
            .catch(async (error) => {
                await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                // await outputFilePaths.forEach(async (outputFilePath : string)=> {
                //     await RemoveFile(outputFilePath);
                // })
                console.error('Error during conversion:', error);
            });
    }

})

/**
 * Remove Image of Event
 */
router.delete('/images', async (req: any, res: any) => {
    const id = req.query.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const eventService: IEventService = new EventService();
        const response = await eventService.Remove(id);

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
    if (id === undefined || id === null) {
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


const uploadEventMainImage = multer({
    storage: EventImagesStorage,
    limits: { fileSize: "5000000" }, //5 MB
    fileFilter: (req: any, file: any, cb: any) => {
        const fileTypes = /png|jpg|jpeg|webp/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {

            return cb(null, true)
        }
        cb('Give proper file format to upload')
    }
}).single('mainImageURL');


/**
 * Add Event Detail
 */
router.post('/', uploadEventMainImage, async (req: any, res: any) => {

    try {


        let eventDto: EventDto | ErrorDto | undefined = validateEvent(req.body);
        //let eventImageDtos : EventImageDto[] | ErrorDto | undefined = validateEventImages(req.body);
        // console.log("EventDto :", eventDto)

        if (!eventDto) {
            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
        }
        else if (eventDto instanceof ErrorDto) {
            res.status(parseInt(eventDto.errorCode)).send(eventDto);
        }
        else {


            const imageURL = req.file.path;
            // const imageFileName = req.file.filename
            const outputDir = 'Images/Event-Webp';
            const outputFile = `${Date.now()}-event.webp`;

            // Ensure the output directory exists
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const outputFilePath = path.join(outputDir, outputFile);

            sharp(imageURL)
                .rotate()
                .webp({ quality: 90, lossless: true }) // convert to webp format
                .toFile(outputFilePath)
                .then(async (data: any) => {
                    if (eventDto instanceof EventDto) {
                        eventDto.mainImageURL = outputFile;

                        if (!eventDto.mainImageURL) {
                            await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
                        }
                        else {
                            const eventService: IEventService = new EventService();
                            const response = await eventService.Create(eventDto);

                            await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                            if (!response) {
                                await RemoveFile(outputFilePath);
                                res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                                    status: 0,
                                    message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
                                })
                            }
                            else if (response?.status === 0) {
                                await RemoveFile(outputFilePath);
                                res.send(response)
                            }
                            else if (response instanceof ApiResponseDto) {
                                res.send(response)
                            }
                        }

                    }
                })
                .catch(async (error: any) => {
                    await RemoveFile(outputFilePath);
                    // await RemoveFile(process.cwd() + '/Images/Event');
                    res.status(500).send({
                        status: 0,
                        message: String(error)
                    })
                })
        }
    }
    catch (error: any) {
        res.status(500).send({
            status: 0,
            message: String(error)
        })
    }
});



/**
 * Update Event Detail
 */
router.put('/', uploadEventMainImage, async (req: any, res: any) => {
    const id = req.query.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {

        let eventDto: EventDto | ErrorDto | undefined = validateEvent(req.body);

        console.log(eventDto)

        if (!eventDto || !id) {
            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
        }
        else if (eventDto instanceof ErrorDto) {
            res.status(parseInt(eventDto.errorCode)).send(eventDto);
        }
        else {

            const eventService: IEventService = new EventService();

            //check for image file to be updated
            if (req.file?.path) {

                const imageURL = req.file.path;
                // const imageFileName = req.file.filename
                const outputDir = 'Images/Event-Webp';
                const outputFile = `${Date.now()}-event.webp`;

                // Ensure the output directory exists
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                const outputFilePath = path.join(outputDir, outputFile);
                sharp(imageURL)
                    .rotate()
                    .webp({  quality: 90, lossless: true }) // convert to webp format
                    .toFile(outputFilePath)
                    .then(async (data: any) => {

                        let response: any = await eventService.RemoveEventMainImage(id);

                        if (response?.status == 1 && eventDto instanceof EventDto) {
                            eventDto.mainImageURL = outputFile;
                            response = await eventService.Update(eventDto, id);
                        }

                        if (!response) {
                            res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
                                status: 0,
                                message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
                            })
                        }
                        else if (response?.status === 0) {
                            await RemoveFile(outputFilePath);
                            res.send(response)
                        }
                        else {
                            res.send(response)
                        }

                        await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                    })
                    .catch(async (error: any) => {
                        await RemoveFile(outputFilePath);
                        await RemoveFilesFromDirectory(process.cwd() + '/Images/Event');
                        res.status(400).send({
                            status: 0,
                            message: String(error)
                        })
                    })
            }
            else {
                let response = await eventService.Update(eventDto, id);

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
        }
    }
})

/**
 * remove Event Entity by id
 */
router.delete('/', async (req: any, res: any) => {
    const id = req.query.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const eventService: IEventService = new EventService();
        const response = await eventService.Remove(id);

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


//#region Image Convertion function to Webp format  


const convertToWebP = async (filePaths: string[], outputDir: string) => {

    let outputFiles: string[] = [];
    let outputFilePaths: string[] = [];

    try {
        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const conversionPromises = filePaths.map(async (imageURL) => {
            const outputFile = `${Date.now()}-${path.basename(imageURL, path.extname(imageURL))}.webp`;
            const outputFilePath = path.join(outputDir, outputFile);

            await sharp(imageURL)
                .rotate()
                .webp({ quality: 60 })
                .toFile(outputFilePath)

            outputFiles.push(outputFile);
            outputFilePaths.push(outputFilePath);
            console.log(`${imageURL} converted to ${outputFilePath}`);
        });
        await Promise.all(conversionPromises);

        return outputFiles;
    }
    catch (error) {
        // Handle exceptions by cleaning up created files
        console.error('Error during conversion:', error);

        // Remove all created files
        outputFilePaths.forEach(async (filePath) => {
            await RemoveFile(filePath);
            console.log(`Removed file: ${filePath}`);
        });

        throw error; // Re-throw the error after cleanup
    }


}

//#endregion

module.exports = router;