const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const db = require('./config/db')



const initApp = async () => {
    const PORT = process.env['PORT'] ?? 3030
    const commonURL = '/api/v1';

    try {

        await db.authenticate();
        console.log("Connection has been established successfully")
        //Middleware
        app.use(bodyParser.json())
        app.use(upload.array())

        //routes
        const personController = require('./controller/person-controller');

        app.use(`${commonURL}/person`, personController);


        if (process.env['NODE_ENV'] === "production") {
            app.use(express.static("frontend/build"));
            const path = require("path")
            app.get("*", (req: any, res: any) => {
                res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
            })
        }

        app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`)
        })

    } catch (error) {
        console.log(error)
    }

}

initApp();
