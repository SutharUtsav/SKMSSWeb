import { PORT } from "./env";

require('dotenv')
const express = require('express')
const app = express()

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
