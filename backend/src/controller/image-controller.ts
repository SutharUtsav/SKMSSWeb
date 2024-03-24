import { upload } from "../config/multer";
import { isValidEnumCategoryValue } from "../consts/enumCommonImagesCategory";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { CommonImagesDto } from "../dtos/common-imaages-dto";
import { RemoveFilesFromDirectory } from "../helper/file-handling";
import { CommonImagesService, ICommonImagesService } from "../service/common-image-service";
import { CommunicationService, ICommunicationService } from "../service/communication-service";

const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

router.get('/profile-image/:imageName', async (req: any, res: any) => {
  console.log("In this")
  // Get the image name from the request
  const imageName = req.params.imageName;

  try {
    // Check if the image exists
    const imageFile = await fs.readFileSync(process.cwd() + `/Images/Profile-Webp/${imageName}`);
    if (!imageFile) {
      console.log("object")
      res.status(404).send({
        status: 0,
        data: 'Image not found'
      });
    }

    // Set the response header to send the image file
    res.setHeader('Content-Type', 'image/jpeg');

    // Send the image file to the client
    res.send(imageFile);
  }
  catch (error: any) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      status: 0,
      data: "Image not found"
    })
  }
})



//#region Common Images model specific api

/**
 * Get Common Image based on image name
 */
router.get('/common-image/:imageName', async (req: any, res: any) => {
  // Get the image name from the request
  const imageName = req.params.imageName;

  try {
    // Check if the image exists
    const imageFile = await fs.readFileSync(process.cwd() + `/Images/Common-Webp/${imageName}`);
    if (!imageFile) {
      console.log("object")
      res.status(404).send({
        status: 0,
        data: 'Image not found'
      });
    }

    // Set the response header to send the image file
    res.setHeader('Content-Type', 'image/jpeg');

    // Send the image file to the client
    res.send(imageFile);
  }
  catch (error: any) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      status: 0,
      data: "Image not found"
    })
  }
})


/**
 * Get Common Image
 */
router.get('/common-image', async (req: any, res: any) => {

  const category = req.query.category;

  const commonImageService: ICommonImagesService = new CommonImagesService();
  const response = await commonImageService.GetRecords(category ? category : null);

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




// Multer setup for image upload
const commonImageStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const outputDir = 'Images/Common';

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    cb(null, outputDir)
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const uploadCommonImage = multer({
  storage: commonImageStorage,
  limits: { fileSize: "10000000" }, //10 MB
  fileFilter: (req: any, file: any, cb: any) => {
    const fileTypes = /jpeg|png|jpg|JPG|JPEG|PNG|webp/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if (mimeType && extname) {
      return cb(null, true)
    }
    cb('Give proper file format to upload')
  }
}).single('image');


router.post('/common-image', uploadCommonImage, async (req: any, res: any) => {
  const imageURL = req.file.path;

  const outputDir = 'Images/Common-Webp';
  const outputFile = Date.now() + '.webp';

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilePath = path.join(outputDir, outputFile);

  sharp(imageURL)
    .rotate()
    .webp({ quality: 80 }) // convert to webp format
    .toFile(outputFilePath)
    .then(async (data: any) => {
      const body: CommonImagesDto = req.body;
      body.imageURL = outputFile;

      if (!body || (body && !body.category) || (body.category && !isValidEnumCategoryValue(body.category))) {
        await RemoveFilesFromDirectory(process.cwd() + '/Images/Profile');
        res.send({ status: EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG], message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG] })
      }
      else {
        const commonImageService: ICommonImagesService = new CommonImagesService();
        const response = await commonImageService.Create(body);

        await RemoveFilesFromDirectory(process.cwd() + '/Images/Common');
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
    .catch(async (error: any) => {
      await RemoveFilesFromDirectory(process.cwd() + '/Images/Common');
      res.status(400).send({
        status: 0,
        message: String(error)
      })
    })
})

/**
 * Remove Common Image
 */
router.delete('/common-image', async (req: any, res: any) => {
  const id = req.query.id;

  if (id === undefined || id === null) {
    res.status(EnumErrorMsgCode[EnumErrorMsg.API_BAD_REQUEST]).send({
      status: 0,
      message: EnumErrorMsgText[EnumErrorMsg.API_BAD_REQUEST]
    })
  }
  else {
    const commonImageService: ICommonImagesService = new CommonImagesService();
    const response = await commonImageService.Remove(id);

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

router.get('/send-mail', async (req: any, res: any) => {
  const communicationService: ICommunicationService = new CommunicationService();
  await communicationService.SendMail('uttusuthar24@gmail.com', 'utsav suthar');

  res.send("Mail Sent")

})
module.exports = router