const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * Add VastiPatrak Template
 */
router.post('/add-template', async (req: any, res: any) => {

})

/**
 * Generate VastiPatrak
 */
router.get('/generate', async (req: any, res: any) => {
    fs.readFile(path.join('VastiPatrak/templates', 'Template.html'), 'utf8', (err: any, data: any) => {
        if (err) {
            console.error(err);
            return;
        }

        const printableData = [{
            username: "Utsav",
        }, {
            username: "Utsav"
        }]
        try {
            const htmlContent = cheerio.load(data);

            const familyName = htmlContent('.Family-Name')
            familyName.text("Bhona");

            console.log(familyName.html())
            
            

        } catch (error: any) {
            console.log("Error", error)
        }

        // `data` contains the HTML content of the file
        // console.log(data)
    })

    res.send({})
})



module.exports = router