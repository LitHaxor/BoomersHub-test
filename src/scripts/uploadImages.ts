import { uploadImageToS3 } from "../libs/aws";
import { createReadStream, readdirSync } from "fs";
import { join } from "path";

async function uploadImagesFromFolders(path: string) {
  const imagePath = join(__dirname, "src", path);
  const folders = readdirSync(imagePath);

  for await (const folder of folders) {
    const files = readdirSync(join(imagePath, folder));

    for await (const file of files) {
      const readStream = createReadStream(join(imagePath, folder, file));

      await uploadImageToS3(
        { filename: file, createReadStream: () => readStream },
        folder
      );
    }
  }
}

uploadImagesFromFolders("../../images");
