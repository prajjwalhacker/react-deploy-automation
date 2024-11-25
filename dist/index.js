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
const simpleGit = require('simple-git');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const storage = new Storage({ keyFilename: 'GOOGLE_API_CRED.json' });
const bucketName = 'vercel-static-bucket-test';
function uploadFile2(filename, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        yield storage.bucket(bucketName).upload(filename, {
            destination: destination, // Destination file name in the bucket
        });
        console.log(`${filename} uploaded to ${bucketName}`);
    });
}
function uploadFile(filename, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Log the filename and destination to ensure they're correct
            console.log(`Uploading ${filename} to ${bucketName} as ${destination}`);
            // Normalize paths for cross-platform compatibility
            const normalizedFilename = path.resolve(filename); // Convert to absolute path if it's relative
            const normalizedDestination = destination.replace(/\\/g, '/'); // Ensure forward slashes for Google Cloud
            // Log the normalized paths
            console.log(`Normalized Filename: ${normalizedFilename}`);
            console.log(`Normalized Destination: ${normalizedDestination}`);
            // Perform the upload
            yield storage.bucket(bucketName).upload(normalizedFilename, {
                destination: normalizedDestination, // Destination file name in the bucket
            });
            console.log(`${normalizedFilename} uploaded to ${bucketName} as ${normalizedDestination}`);
        }
        catch (error) {
            console.error('Error uploading file:', error);
        }
    });
}
app.post('/deploy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        yield simpleGit().clone(repoUrl, directoryPath);
        res.json({ id });
    }
    catch (err) {
        console.log("err");
        console.log(err);
    }
}));
app.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directoryName = 'my-react-project';
    const files = getAllFilesPath(`./dist/${directoryName}/bl6nd`);
    files.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield uploadFile2(item, `${(_a = item.split('dist\\')) === null || _a === void 0 ? void 0 : _a[1]}`);
    }));
    res.json({});
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
