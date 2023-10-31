const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/profile-image/:imageName', async (req:any, res: any)=>{
    console.log("In this")
    // Get the image name from the request
  const imageName = req.params.imageName;

  // Check if the image exists
  const imageFile = fs.readFileSync(process.cwd() + `/Images/Profile-Webp/${imageName}`);
  if (!imageFile) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Set the response header to send the image file
  res.setHeader('Content-Type', 'image/jpeg');

  // Send the image file to the client
  res.send(imageFile);
})

module.exports = router