import { testDbConnection } from "./config/db";

const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

const PORT = process.env['PORT'] ?? 3030
const commonURL = '/api/v1';

//Middleware
app.use(bodyParser.json())
app.use(upload.array())
testDbConnection()

//routes
const personController = require('./controller/person-controller');


app.use(`${commonURL}/person`, personController);


if(process.env['NODE_ENV'] === "production"){
    app.use(express.static("frontend/build"));
    const path = require("path")
    app.get("*",(req:any,res:any)=>{
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})