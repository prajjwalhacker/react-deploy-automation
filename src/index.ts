import { generate } from "./utils";

const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const { getAllFilesPath }= require('./utils'); 




const app = express();
const port = 3000;

app.use(express.json());

app.use(cors())

const storage = new Storage({keyFilename: 'GOOGLE_API_CRED.json'});

const bucketName = 'vercel-static-bucket-test';

async function uploadFile(filename: any, destination: any) {
  await storage.bucket(bucketName).upload(filename, {
    destination: destination,  // Destination file name in the bucket
  });
  console.log(`${filename} uploaded to ${bucketName}`);
}


uploadFile('dist\\my-react-project\\9mx2z\\.git\\config', 'index.js');

app.post('/deploy', (req: any, res: any) => {
   const repoUrl = req.body.repoUrl;
   console.log(repoUrl);
   const directoryName = 'my-react-project';

   const id = generate();

   const directoryPath = path.join(__dirname, `${directoryName}/${id}`);

   if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created at: ${directoryPath}`);
   } else {
     console.log(`Directory already exists at: ${directoryPath}`);
   }
   exec(`git clone ${repoUrl} ${directoryPath}`, (error: any, stdout: any, stderr: any) => {
     if (error) {
       console.error(`exec error: ${error}`);
       return;
     }
     console.log(`stdout: ${stdout}`);
     console.log(`stderr: ${stderr}`);
     const res  = getAllFilesPath(`./dist/my-react-project/${id}`);

   });

    res.json({ id });
   });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});