import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  awsAccessKey,
  awsSecretAccessKey,
  bucketName,
  region,
} from "../../config/config";

export const s3Uploader = async ({ file, key }) => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
    region: region,
  });
  const fileName = `${Date.now()}-${file.name}`;
  let keyWithNoSpace = key + fileName;
  keyWithNoSpace = keyWithNoSpace.split(" ").join("");
  const uploadParams = {
    Bucket: bucketName,
    Key: keyWithNoSpace,
    Body: file,
    ContentType: getContentType(file.name),
  };

  try {
    // Upload the file to S3
    const parallelUpload = new Upload({
      client: s3Client,
      params: uploadParams,
    });
    await parallelUpload.done();
    return uploadParams.Key; // Return the uploaded object's key
  } catch (error) {
    console.error("Error in uploading file:", error);
    throw error;
  }
};

const getContentType = (filename) => {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "svg":
      return "image/svg+xml";
    case "png":
      return "image/png";
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "avi":
      return "video/x-msvideo";
    case "mpeg":
      return "video/mpeg";
    case "mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
};
