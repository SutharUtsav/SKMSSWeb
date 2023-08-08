const express = require('express');
const router = express.Router();

router.get('/',async (req: any,res: any)=>{
    await res.send("Get Persons");
})

router.post('/', async (req: any,res: any)=>{
    console.log( req.body)
    console.log( req.body.name)
    await res.send("Post Persons");
})

module.exports = router