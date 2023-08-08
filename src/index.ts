import { sequelize, testDbConnection } from "./config/db";

const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()

const PORT = process.env['PORT'] ?? 3030
 
testDbConnection()

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