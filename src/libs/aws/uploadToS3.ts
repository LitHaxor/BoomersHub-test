import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../../configs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
const Bucket = AWS_BUCKET_NAME;

async function checkIfObjectExists(Key: string) {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket,
      Key,
    });

    const objectExists = await client.send(getObjectCommand);

    if (objectExists.$metadata.httpStatusCode === 200) {
      console.log(`File already exists in S3: ${Key}`);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const uploadImageToS3 = async (file: any, folder: string) => {
  try {
    const { filename, createReadStream } = await file;
    const fileStream = createReadStream();
    const Key = `images/${folder}/${filename}`;

    if (await checkIfObjectExists(Key)) {
      return;
    }

    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body: fileStream,
    });

    const result = await client.send(command);

    console.log(`Successfully Uploaded to S3: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
    console.error(`Error Uploading to S3: ${error.message}`);
    return null;
  }
};

export async function getUploadedImagesFromS3() {
  const command = new ListObjectsCommand({
    Bucket,
    Prefix: "images",
  });

  const result = await client.send(command);

  const imageUrls = result?.Contents?.map((content) => {
    return `https://${Bucket}.s3.amazonaws.com/${content.Key}`;
  });

  return imageUrls;
}
