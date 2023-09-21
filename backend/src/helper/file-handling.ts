const path = require('path');
const fs = require('fs');

const responseMsg = {
    FILE_NOT_EXIST : "File Doesn't Exist",
    FILE_REMOVED : "File Removed Successfully"
}

const responseCode = {
    FILE_NOT_EXIST : -1,
    FILE_REMOVED : 1
}

export const RemoveFile = async (filePath: string) => {
    const absoluteFilePath = path.resolve(filePath);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(absoluteFilePath)) {
        await fs.unlink(absoluteFilePath, (err: any) => {
            if (err) {
                return {
                    status: 0,
                    message: err
                };
            }
            else {
                return { 
                    status: responseCode.FILE_REMOVED,
                    message: responseMsg.FILE_REMOVED
                };
            }
        });
    }

    return { 
        status: responseCode.FILE_NOT_EXIST,
        message: responseMsg.FILE_NOT_EXIST
     }
}