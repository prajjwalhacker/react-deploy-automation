import { generate } from "./utils";

const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const { getAllFilesPath }= require('./utils'); 
const simpleGit = require('simple-git');




const app = express();
const port = 3000;

app.use(express.json());

app.use(cors())

const storage = new Storage({keyFilename: 'GOOGLE_API_CRED.json'});

const bucketName = 'vercel-static-bucket-test';

async function uploadFile2(filename: any, destination: any) {
  await storage.bucket(bucketName).upload(filename, {
    destination: destination,  // Destination file name in the bucket
  });
  console.log(`${filename} uploaded to ${bucketName}`);
}






async function uploadFile(filename: any, destination: any) {
  try {
    // Log the filename and destination to ensure they're correct
    console.log(`Uploading ${filename} to ${bucketName} as ${destination}`);
    
    // Normalize paths for cross-platform compatibility
    const normalizedFilename = path.resolve(filename);  // Convert to absolute path if it's relative
    const normalizedDestination = destination.replace(/\\/g, '/');  // Ensure forward slashes for Google Cloud
    
    // Log the normalized paths
    console.log(`Normalized Filename: ${normalizedFilename}`);
    console.log(`Normalized Destination: ${normalizedDestination}`);

    // Perform the upload
    await storage.bucket(bucketName).upload(normalizedFilename, {
      destination: normalizedDestination,  // Destination file name in the bucket
    });

    console.log(`${normalizedFilename} uploaded to ${bucketName} as ${normalizedDestination}`);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

app.post('/deploy', async (req: any, res: any) => {
  try {
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
   await simpleGit().clone(repoUrl, directoryPath);

    res.json({ id });
    }
    catch (err) {
      console.log("err");
      console.log(err);
    }
   });

app.post('/upload', async (req: any,  res: any) => {
    
const directoryName = 'my-react-project';
const files = getAllFilesPath(`./dist/${directoryName}/bl6nd`);

files.forEach(async (item: any) => {
   await uploadFile2(item, `${item.split('dist\\')?.[1]}`);
})

res.json({});

})


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});