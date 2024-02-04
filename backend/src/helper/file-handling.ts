const path = require('path');
const fs = require('fs');

const responseMsg = {
  FILE_NOT_EXIST: "File Doesn't Exist",
  FILE_REMOVED: "File Removed Successfully"
}

const responseCode = {
  FILE_NOT_EXIST: -1,
  FILE_REMOVED: 1
}

/**
 * Remove Specific file base on file path
 * @param filePath 
 * @returns 
 */
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

/**
 * Remove every files from a directory
 * @param folderPath 
 */
export const RemoveFilesFromDirectory = async (directoryPath: string) => {

  await fs.readdir(directoryPath, (err: any, files: any) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Iterate over the files in the directory
    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      // Check if the file is a regular file (not a directory)
      fs.stat(filePath, (err: any, stats: any) => {
        if (err) {
          console.error('Error checking file stats:', err);
          return;
        }

        if (stats.isFile()) {
          // Remove the file
          fs.unlink(filePath, (err: any) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
          });
        }
      });
    }
  });

}



interface FileContentDictionary {
  [fileName: string]: string;
}

/**
 * Read every files from a directory
 * @param directoryPath 
 */
export const ReadFilesFromDirectory = async (directoryPath: string) => {
  const files = await fs.readdirSync(directoryPath);
  const fileContentDict: FileContentDictionary = {};

  files.forEach(async(file:any) => {
    const filePath = path.join(directoryPath, file);

    // Read the content of the file
    const fileContent = await fs.readFileSync(filePath, 'utf-8');
    fileContentDict[file] = fileContent;
    // console.log(`Content of ${file}:`);
    // console.log(fileContent);
    // console.log('----------------------');

  });

  return fileContentDict
}