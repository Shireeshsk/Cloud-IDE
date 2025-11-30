import { minioClient } from "./minioClient.js";
import {config} from 'dotenv'
config()
const bucketName = process.env.BUCKET_NAME;
export const minioConfig = function(){
  minioClient.bucketExists(bucketName, function (err, exists) {
    if (err) return console.log("Error checking bucket:", err);
    if (!exists) {
      minioClient.makeBucket(bucketName, "us-east-1", function (err) {
        if (err) return console.log("Error creating bucket:", err);
        console.log(`✅ Bucket '${bucketName}' created successfully!`);
      });
    } else {
      console.log(`✅ Bucket '${bucketName}' already exists.`);
    }
  });
}
