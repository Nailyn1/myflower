import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "./s3Client.js";
import { PlantImageDto } from "@myflower/shared";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const generatePresignedUrls = async (
  plantId: number,
  images: PlantImageDto[]
): Promise<
  (PlantImageDto & {
    uploadUrl: string;
    fields: Record<string, string>;
    key: string;
  })[]
> => {
  const bucket = process.env.S3_BUCKET_PUBLIC!;
  const result: (PlantImageDto & {
    uploadUrl: string;
    fields: Record<string, string>;
    key: string;
  })[] = [];

  for (const img of images) {
    const key = `${plantId}/${Date.now()}-${img.fileName}`;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: key,
      Expires: 300,
      Conditions: [
        ["content-length-range", 0, MAX_FILE_SIZE],
        ["eq", "$Content-Type", img.mimeType],
      ],
      Fields: { "Content-Type": img.mimeType },
    });

    result.push({ ...img, key, uploadUrl: url, fields });
  }

  return result;
};
