import { generateId } from "@arkyn/shared";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { FileUpload } from "@mjackson/form-data-parser";
import sharp from "sharp";
import { Readable } from "stream";

function sanitizeFilename(original: string): string {
  const dotIdx = original.lastIndexOf(".");
  const base = dotIdx > 0 ? original.slice(0, dotIdx) : original;
  const ext = dotIdx > 0 ? original.slice(dotIdx) : "";

  const sanitizedBase = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 100);

  return sanitizedBase + ext;
}

type ConstructorProps = {
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsS3Bucket: string;
  awsDomain: string;
  width?: number;
  height?: number;
  quality?: number;
};

class FileAdapter {
  readonly awsRegion: string;
  readonly awsAccessKeyId: string;
  readonly awsSecretAccessKey: string;
  readonly awsS3Bucket: string;
  readonly awsDomain: string;
  readonly width?: number;
  readonly height?: number;
  readonly quality?: number;

  constructor(props: ConstructorProps) {
    this.awsRegion = props.awsRegion;
    this.awsAccessKeyId = props.awsAccessKeyId;
    this.awsSecretAccessKey = props.awsSecretAccessKey;
    this.awsS3Bucket = props.awsS3Bucket;
    this.awsDomain = props.awsDomain;
    this.width = props.width;
    this.height = props.height;
    this.quality = props.quality;
  }

  async uploadFile(file: FileUpload): Promise<string> {
    const contentType = file.type;
    const nodeStream = Readable.fromWeb(file.stream() as any);

    const chunks: Buffer[] = [];
    for await (const chunk of nodeStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const rawBuffer = Buffer.concat(chunks);

    let uploadBuffer = rawBuffer;

    if (this.width || this.height || this.quality) {
      let processor = sharp(rawBuffer);

      if (this.width || this.height) {
        processor = processor.resize(this.width, this.height, { fit: "cover" });
      }

      if (this.quality) {
        const mime = contentType.toLowerCase();
        if (mime === "image/jpeg" || mime === "image/jpg") {
          processor = processor.jpeg({ quality: this.quality });
        } else if (mime === "image/webp") {
          processor = processor.webp({ quality: this.quality });
        } else if (mime === "image/png") {
          processor = processor.png({ quality: this.quality });
        }
      }

      uploadBuffer = await processor.toBuffer();
    }

    const uploadParams = {
      Bucket: this.awsS3Bucket,
      Key: `uploads/${generateId("text", "v4")}-${sanitizeFilename(file.name)}`,
      Body: uploadBuffer,
      ContentType: contentType,
      ContentLength: uploadBuffer.length,
    };

    const s3Client = new S3Client({
      region: this.awsRegion,
      credentials: {
        accessKeyId: this.awsAccessKeyId,
        secretAccessKey: this.awsSecretAccessKey,
      },
    });

    await s3Client.send(new PutObjectCommand(uploadParams));

    return `${this.awsDomain}/${uploadParams.Key}`;
  }
}

export { FileAdapter };
