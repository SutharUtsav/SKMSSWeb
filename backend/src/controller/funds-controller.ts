import { upload } from "../config/multer";

const express = require('express');
const router = express.Router();


//#region CRUD operation on Funds Entity

/**
 * Get All Records of Funds and their Donor
 */
router.get('/', async (req: any, res: any) => {
    // const familyService: IFamilyService = new FamilyService();
    // const response = await familyService.GetRecords();

    // if (!response) {
    //     res.status(EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG]).send({
    //         status: 0,
    //         message: EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG]
    //     })
    // }
    // else {
    //     res.send(response)
    // }
})


/**
 * Get Record of Funds and Donor by fundId
 */
router.get('/:id', async (req:any, res:any)=>{

})



/**
 * Get Records of Donors
 */
router.get('/donor', async (req:any, res:any)=>{

})

/**
 * Get Record of Donor by donorId
 */
router.get('/donor/:id',  async (req:any, res:any)=>{

})

/**
 * Add Donor and Funds detail
 */
router.post('/', upload, async (req:any, res:any) => {
    
})

/**
 * Update Donor and Funds detail
 */
router.put('/', upload, async(req:any, res:any) => {
    const id = req.query.id;

})

// /**
//  * Delete Funds Details
//  */
// router.delete('/', async (req:any, res:any) => {
//     const id = req.query.id;
    
// })
//#endregion


module.exports = router;