import { Person } from "../model/person";

const express = require('express');
const router = express.Router();

router.get('/',async (req: any,res: any)=>{
    await res.send("Get Persons");
})

router.post('/', async (req: any,res: any)=>{
    await Person.create({
        name1: req.body.name, 
        surname: req.body.surname,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

    res.send("Post Persons");
})

module.exports = router