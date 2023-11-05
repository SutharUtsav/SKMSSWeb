import { CommunicationService, ICommunicationService } from "../service/communication-service";

const express = require('express');
const router = express.Router();
const fs = require('fs');

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
        status : 0,
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


router.get('/send-mail', async (req: any, res: any) => {
  const communicationService : ICommunicationService = new CommunicationService();
  await communicationService.SendMail('uttusuthar24@gmail.com','utsav suthar');

  res.send("Mail Sent")

} )
module.exports = router