import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";

var jwt = require('jsonwebtoken');


export const authMiddleware = (req: any, res: any,next:any) => {
    const token: string = req.headers['authorization'];

    if (!token) {
        return res.status(EnumErrorMsgCode[EnumErrorMsg.API_UNAUTHORIZED]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_UNAUTHORIZED]
        });
    }

    try {
        const decodedToken = jwt.verify(token.replace('Bearer ',''), process.env['JWT_SECRET']);

        req.user = decodedToken.user;
        next()
       
    } catch (error) {
        return res.status(EnumErrorMsgCode[EnumErrorMsg.API_UNAUTHORIZED]).send({
            status: 0,
            message: EnumErrorMsgText[EnumErrorMsg.API_UNAUTHORIZED]
        });
    }

}