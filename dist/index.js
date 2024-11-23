"use strict";
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use((req, res) => {
    console.log("Console");
});
app.post('/deploy', (req, res) => {
    const repoUrl = req.body.repoUrl;
    const directoryName = 'my-react-project';
    const directoryPath = path.join(__dirname, directoryName);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory created at: ${directoryPath}`);
    }
    else {
        console.log(`Directory already exists at: ${directoryPath}`);
    }
    exec(`git clone ${repoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    res.json({});
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
