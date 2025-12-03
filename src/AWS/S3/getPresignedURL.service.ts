import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import { ErrorI } from "../../interfaces/error.interface";
import { logger } from "../../logger/logger";

export async function getPresignedURL(objectKey: string): Promise<string> {
  try {
    if (!process.env.AWS_BUCKET_NAME) {
      const responseError: ErrorI = { error: true, message: "No se ha definido el nombre del bucket", statusCode: 500 };
      throw responseError;
    }

    const bucketName: string = process.env.AWS_BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL válida por 1 hora
    return url;
  } catch (error: any) {
    const responseError: ErrorI = { error: true, message: error.message || `${error}`, statusCode: 500 };
    logger.error(responseError.message || `${error}`);
    throw responseError;
  }
}
