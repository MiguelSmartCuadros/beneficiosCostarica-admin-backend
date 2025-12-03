import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "./s3Client";
import { ErrorI } from "../../interfaces/error.interface";

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<string> {
  try {
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      const responseError: ErrorI = { error: true, message: "No se ha definido el nombre del bucket", statusCode: 500 };
      throw responseError;
    }

    const bucketName = process.env.AWS_BUCKET_NAME!;
    const key = `${uuidv4()} - ${fileName}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    const command: PutObjectCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return key;
  } catch (error: any) {
    const responseError: ErrorI = { error: true, message: `${error.message}`, statusCode: 500 };
    throw responseError;
  }
}
