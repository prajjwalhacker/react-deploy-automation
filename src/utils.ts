const fs = require('fs');
const path = require('path');
export const generate = () => {
   const str = 'abcdefghijklmnopqrstuvwxyz1234567890';
   let len=5;
   let finalString = '';

   for (let i =0; i < len; i++) {
       finalString += str[Math.floor(Math.random() * str.length)];
   }
   return finalString;
}


export const getAllFilesPath = (dirPath: any) => {
    let filePaths: any = [];
    const files = fs.readdirSync(dirPath);
    files.forEach((item: any) => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            filePaths = filePaths.concat(getAllFilesPath(fullPath)); // Recursion
        }
        else {
            filePaths.push(fullPath);
        }
    })
    return filePaths;
}