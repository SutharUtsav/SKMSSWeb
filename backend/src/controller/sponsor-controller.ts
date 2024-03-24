import { upload } from "../config/multer";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SponsorDto, sponsorshipActivationList } from "../dtos/sponsor-dto";
import { RemoveFile, RemoveFilesFromDirectory } from "../helper/file-handling";
import { validateSponsor, validateSponsorSponsorships, validateSponsorship } from "../helper/validationCheck";
import { ISponsorService, SponsorService } from "../service/sponsor-service";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

//#region operations on Sponsor Attachment

/**
 * Get Sponsorship attachment file
 */
router.get('/attachment/:fileName', async (req: any, res: any) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join('Images/Sponsor-Webp', fileName);


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

//#endregion


//#region CRUD operation on Sponsor Entity

/**
 * Get All Records of Sponsors and their sponsorships
 */
router.get('/', async (req: any, res: any) => {
    const sponsorService: ISponsorService = new SponsorService();
    const response = await sponsorService.GetRecords(false);

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
 * Get Record of sponsor and sponsorship by sponsorId
 */
router.get('/:id', async (req: any, res: any) => {

    const id = req.params.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        const sponsorService: ISponsorService = new SponsorService();
        const response = await sponsorService.GetRecords(false, id);

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
 * Get active sponsorships
 */
router.get('/sponsorship/active', async (req: any, res: any) => {

    const sponsorService: ISponsorService = new SponsorService();
    const response = await sponsorService.GetRecords(false, undefined, true);

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


//multer file storage setup for sponsorship attachments
const SponsorshipAttachmentStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const outputDir = `Images/Sponsor`;

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


const uploadSponsorshipAttachments = multer({
    storage: SponsorshipAttachmentStorage,
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
}).any('attachments')


/**
 * Add Sponsor and Sponsorship detail
 */
router.post('/', uploadSponsorshipAttachments, async (req: any, res: any) => {
    const paths = _.map(req.files, 'path');
    const outputDir = 'Images/Sponsor-Webp';

    convertToWebP(paths, outputDir)
        .then(async (outputFilePaths: any) => {
            console.log('Conversion completed successfully.');
            console.log(outputFilePaths)

            const sponsorDto: SponsorDto | ErrorDto | undefined = validateSponsorSponsorships(req.body, outputFilePaths);

            console.log("sponsorDto : " + sponsorDto)
            if (!sponsorDto || sponsorDto instanceof ErrorDto) {
                await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
                outputFilePaths.forEach(async (outputFilePath: string) => {
                    await RemoveFile(outputFilePath);
                })
                res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
            }
            else {
                const sponsorService: ISponsorService = new SponsorService();
                const response = await sponsorService.Create(sponsorDto);

                await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
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
                    res.send(response)
                }
                else if (response instanceof ApiResponseDto) {
                    res.send(response)
                }

            }
        })
        .catch(async (error) => {
            await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
            // await outputFilePaths.forEach(async (outputFilePath : string)=> {
            //     await RemoveFile(outputFilePath);
            // })
            console.error('Error during conversion:', error);
        });

})

/**
 * Add new sponsorship record for a sponsor
 */
router.post('/:id', uploadSponsorshipAttachments, async (req: any, res: any) => {
    const id = req.params.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {

        const paths = _.map(req.files, 'path');
        const outputDir = 'Images/Sponsor-Webp';

        convertToWebP(paths, outputDir)
            .then(async (outputFilePaths: any) => {
                console.log('Conversion completed successfully.');
                console.log(outputFilePaths)

                const sponsorDto: SponsorDto | ErrorDto | undefined = validateSponsorSponsorships(req.body, outputFilePaths);

                if (!sponsorDto || sponsorDto instanceof ErrorDto) {
                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
                    outputFilePaths.forEach(async (outputFilePath: string) => {
                        await RemoveFile(outputFilePath);
                    })
                    res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
                }
                else {
                    const sponsorService: ISponsorService = new SponsorService();
                    const response = await sponsorService.Create(sponsorDto, id);

                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
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
                        res.send(response)
                    }
                    else if (response instanceof ApiResponseDto) {
                        res.send(response)
                    }

                }
            })
            .catch(async (error) => {
                await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
                // await outputFilePaths.forEach(async (outputFilePath : string)=> {
                //     await RemoveFile(outputFilePath);
                // })
                console.error('Error during conversion:', error);
            });
    }
})

/**
 * Update Spnsor
 */
router.put('/', upload, async (req: any, res: any) => {
    const id = req.query.id;

    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {
        let sponsorDto: SponsorDto | ErrorDto | undefined = validateSponsor(req.body);

        console.log(sponsorDto)

        if (!sponsorDto) {
            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
        }
        else if (sponsorDto instanceof ErrorDto) {
            res.status(parseInt(sponsorDto.errorCode)).send(sponsorDto);
        }
        else {
            const sponsorService: ISponsorService = new SponsorService();
            let response: any = await sponsorService.Update(sponsorDto, id);
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
})




/**
 * Update Sponsorship Attachment
 */
router.put('/sponsorship/attachment', uploadSponsorshipAttachments, async (req: any, res: any) => {

    const id = req.query.id;
    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {

        const paths = _.map(req.files, 'path');
        const outputDir = 'Images/Sponsor-Webp';

        convertToWebP(paths, outputDir)
            .then(async (outputFilePaths: string[]) => {
                console.log('Conversion completed successfully.');
                console.log(outputFilePaths)

                const sponsorDto: SponsorDto = new SponsorDto();
                sponsorDto.adsAttachments = outputFilePaths.join(',');

                if (!sponsorDto || sponsorDto instanceof ErrorDto) {
                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
                    outputFilePaths.forEach(async (outputFilePath: string) => {
                        await RemoveFile(outputFilePath);
                    })
                    res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
                }
                else {
                    const sponsorService: ISponsorService = new SponsorService();
                    const response: any = await sponsorService.UpdateSponsorshipAttachment(sponsorDto, id);

                    await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
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
                        res.send(response)
                    }
                    else if (response instanceof ApiResponseDto) {
                        res.send(response)
                    }

                }
            })
            .catch(async (error) => {
                await RemoveFilesFromDirectory(process.cwd() + '/Images/Sponsor');
                // await outputFilePaths.forEach(async (outputFilePath : string)=> {
                //     await RemoveFile(outputFilePath);
                // })
                console.error('Error during conversion:', error);
            });
    }

})

/**
 * Update Sponsorship Details
 */
router.put('/sponsorship', upload, async (req: any, res: any) => {

    const id = req.query.id;

    console.log(id);

    if (id === undefined || id === null) {
        res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
        })
    }
    else {

        let sponsorDto: SponsorDto | ErrorDto | undefined = validateSponsorship(req.body);

        console.log(sponsorDto)

        if (!sponsorDto) {
            res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
        }
        else if (sponsorDto instanceof ErrorDto) {
            res.status(parseInt(sponsorDto.errorCode)).send(sponsorDto);
        }
        else {
            const sponsorService: ISponsorService = new SponsorService();
            let response: any = await sponsorService.UpdateSponsorship(sponsorDto, id);
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
})

/**
 * Delete sponsor Details
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
        const sponsorService: ISponsorService = new SponsorService();
        const response = await sponsorService.Remove(id);

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
            const outputFile = `${path.basename(imageURL, path.extname(imageURL))}.webp`;
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