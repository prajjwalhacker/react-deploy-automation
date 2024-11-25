"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilesPath = exports.generate = void 0;
const fs = require('fs');
const path = require('path');
const generate = () => {
    const str = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let len = 5;
    let finalString = '';
    for (let i = 0; i < len; i++) {
        finalString += str[Math.floor(Math.random() * str.length)];
    }
    return finalString;
};
exports.generate = generate;
const getAllFilesPath = (dirPath) => {
    let filePaths = [];
    const files = fs.readdirSync(dirPath);
    files.forEach((item) => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            filePaths = filePaths.concat((0, exports.getAllFilesPath)(fullPath)); // Recursion
        }
        else {
            filePaths.push(fullPath);
        }
    });
    return filePaths;
};
exports.getAllFilesPath = getAllFilesPath;
