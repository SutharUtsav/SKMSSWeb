const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./config/db')
const cors = require('cors')

import { dbContext } from "./model/dbContext";

const initApp = async () => {
    const PORT = process.env['PORT'] ?? 3030
    const commonURL = `/api/v1`;

    try {
        
        //define all database context and associations
        dbContext();

        await db.authenticate();
        console.log("Connection has been established successfully")


        //Middleware
        app.use(cors())
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }));


        //static Images folder
        app.use('/Images', express.static('./Images'))   

        //routes
        const personController = require('./controller/person-controller');
        const roleController = require('./controller/role-controller')
        const rolePermissionController = require('./controller/role-permission-controller');
        const userController = require('./controller/user-controller');
        const userProfileController = require('./controller/user-profile-controller');
        const authController = require('./controller/auth-controller');
        const familyController = require('./controller/family-controller');
        const vastipatrakController = require('./controller/vasti-patrak-controller');
        const imageController = require('./controller/image-controller');
        const eventController = require('./controller/event-controller');
        const samajwadiOccupiedController = require('./controller/samajwadi-occupied-controller');
        const socialWorkerController = require('./controller/social-worker-controller');

        app.use(`${commonURL}/person`, personController);
        app.use(`${commonURL}/role`, roleController);
        app.use(`${commonURL}/role-permission`, rolePermissionController);
        app.use(`${commonURL}/family`, familyController);
        app.use(`${commonURL}/user`, userController);
        app.use(`${commonURL}/user-profile`, userProfileController);
        app.use(`${commonURL}/vastipatrak`, vastipatrakController);
        app.use(`${commonURL}/auth`,authController);
        app.use(`${commonURL}/image`, imageController);
        app.use(`${commonURL}/event`, eventController);
        app.use(`${commonURL}/samajwadi-occupied`, samajwadiOccupiedController);
        app.use(`${commonURL}/social-worker`, socialWorkerController);


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
