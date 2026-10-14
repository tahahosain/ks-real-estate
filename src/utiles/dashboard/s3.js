import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "iran",
  endpoint: process.env.PARSPACK_ENDPOINT,
  credentials: {
    accessKeyId: process.env.PARSPACK_ACCESS_KEY,
    secretAccessKey: process.env.PARSPACK_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default s3Client;
