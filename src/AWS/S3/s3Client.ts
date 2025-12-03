import { S3Client } from "@aws-sdk/client-s3";
// import { fromIni } from "@aws-sdk/credential-provider-ini";

const region: string = process.env.AWS_REGION!;
// const profile: string = "sso-sm-CORP-TEST";

export const s3Client = new S3Client({
  region,
  // credentials: fromIni({ profile }), // QUITAR ESTA LINEA PARA ENTORNO DE PRODUCCION O TEST
});
