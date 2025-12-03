import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { ErrorI } from "../../interfaces/error.interface";
import { logger } from "../../logger/logger";

export async function getObjectFromS3(objectKey: string): Promise<Buffer> {
  try {
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      const responseError: ErrorI = { error: true, message: "No se ha definido el nombre del bucket", statusCode: 500 };
      throw responseError;
    }

    const bucketName = process.env.AWS_BUCKET_NAME!;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const objectS3: GetObjectCommandOutput = await s3Client.send(command);
    const file_byte_array: Uint8Array | undefined = await objectS3.Body?.transformToByteArray();

    if (!file_byte_array) {
      const responseError: ErrorI = { error: true, message: "No se pudo obtener imagen del bucket", statusCode: 500 };
      logger.error(responseError.message);
      throw responseError;
    }

    return Buffer.from(file_byte_array);
  } catch (error: any) {
    const responseError: ErrorI = { error: true, message: error.message || `${error}`, statusCode: 500 };
    throw responseError;
  }
}
