import * as minio from "minio";

export const minioClient = new minio.Client({
  endPoint: "localhost",   
  port: 9000,              
  useSSL: false,           
  accessKey: "minioadmin", 
  secretKey: "minioadmin", 
});
