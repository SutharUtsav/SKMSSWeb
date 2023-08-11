import { PersonDto } from "../dtos/person-dto";
import { Person } from "../model/person";
import { PersonService } from "../service/person-service";

const express = require('express');
const router = express.Router();

router.get('/',async (req: any,res: any)=>{
    await res.send("Get Persons");
})

router.post('/', async (req: any,res: any)=>{

    let personDto : PersonDto = req.body;

    if(personDto?.name && personDto?.surname 
        && personDto?.city && personDto?.currResidency && personDto?.marriedStatus
        && personDto?.birthDate && personDto?.weddingDate && personDto?.education
        && personDto?.occupation && personDto?.mobileNumber){
            
            let personService : PersonService = new PersonService();
            let response = await personService.Create(personDto);
            console.log(response)
        }
    res.send("Post Persons");
})

module.exports = router