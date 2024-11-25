"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const { getAllFilesPath } = require('./utils');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const storage = new Storage({ keyFilename: 'GOOGLE_API_CRED.json' });
const bucketName = 'vercel-static-bucket-test';
function uploadFile(filename, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        yield storage.bucket(bucketName).upload(filename, {
            destination: destination, // Destination file name in the bucket
        });
        console.log(`${filename} uploaded to ${bucketName}`);
    });
}
uploadFile('dist\\my-react-project\\9mx2z\\.git\\config', 'index.js');
app.post('/deploy', (req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const directoryName = 'my-react-project';
    const id = (0, utils_1.generate)();
    const directoryPath = path.join(__dirname, `${directoryName}/${id}`);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory created at: ${directoryPath}`);
    }
    else {
        console.log(`Directory already exists at: ${directoryPath}`);
    }
    exec(`git clone ${repoUrl} ${directoryPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        const res = getAllFilesPath(`./dist/my-react-project/${id}`);
    });
    res.json({ id });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
