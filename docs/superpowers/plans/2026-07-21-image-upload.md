# ImageUpload Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an `ImageUpload` UI component that uploads to S3 on file selection, shows a preview, and integrates with `FormField` for error display — plus backend support for optional resize and quality reduction.

**Architecture:** A single `image-upload.tsx` component wraps a hidden file input inside a drop zone. On file selection it immediately POSTs to `/api/fileUpload` (with optional `?w=&h=&reduceQuality=` query params), stores the returned S3 URL in an `<input type="hidden">` for form submission, and renders one of three visual states: empty drop zone, loading spinner, or image preview. The `FileAdapter` is extended to buffer the incoming file and optionally process it with `sharp` before S3 upload.

**Tech Stack:** React 19 · React Router v7 (SSR) · Tailwind CSS v4 · `sharp` (new) · `@aws-sdk/client-s3` (existing) · `@mjackson/form-data-parser` (existing)

## Global Constraints

- Named imports from React only — never `import * as React`
- Never use `<button>` native — always `<Button>` from `src/client/components/ui/button.tsx`
- Never use `"use client"` directive — not Next.js
- `cn()` from `~/client/lib/utils` for class merging (no `tv()` needed — single-element styling)
- Error border uses `group-data-invalid:border-destructive` (matches existing `Input` pattern)
- `aria-invalid` set via FormField context, not hardcoded
- TypeScript check: `npm run typecheck`

---

### Task 1: Install `sharp` and update `FileAdapter` for image processing

**Files:**
- Modify: `package.json`
- Modify: `src/infra/adapters/fileAdapter.ts`

**Interfaces:**
- Produces: `FileAdapter` constructor now accepts optional `width?: number`, `height?: number`, `quality?: number`
- Produces: `uploadFile(file: FileUpload): Promise<string>` — same signature, now buffers file and optionally processes with `sharp`

- [ ] **Step 1: Install sharp**

```bash
cd /var/www/testes/donation-react-router-v7 && npm install sharp
```

Expected: `sharp` added to `dependencies` in `package.json`. Sharp ships its own TypeScript types — no `@types/sharp` needed.

- [ ] **Step 2: Rewrite `src/infra/adapters/fileAdapter.ts`**

Replace the entire file with:

```ts
import { generateId } from "@arkyn/shared";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { FileUpload } from "@mjackson/form-data-parser";
import sharp from "sharp";
import { Readable } from "stream";

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
      Key: `uploads/${generateId("text", "v4")}`,
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
```

- [ ] **Step 3: Verify types**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Expected: no errors related to `fileAdapter.ts`.

---

### Task 2: Update `api.fileUpload.ts` to forward dimension/quality params

**Files:**
- Modify: `src/main/routes/api.fileUpload.ts`

**Interfaces:**
- Consumes: `FileAdapter` constructor now accepts `width?`, `height?`, `quality?` (from Task 1)
- Produces: endpoint reads `?w=`, `?h=`, `?reduceQuality=` from query string and passes parsed numbers to `FileAdapter`

- [ ] **Step 1: Rewrite `src/main/routes/api.fileUpload.ts`**

Replace the entire file with:

```ts
import type { Route } from "+/api.fileUpload";
import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";
import { FileAdapter } from "~/infra/adapters/fileAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { environmentVariables } from "../config/environmentVariables";

export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const width = url.searchParams.get("w") ? Number(url.searchParams.get("w")) : undefined;
  const height = url.searchParams.get("h") ? Number(url.searchParams.get("h")) : undefined;
  const quality = url.searchParams.get("reduceQuality")
    ? Number(url.searchParams.get("reduceQuality"))
    : undefined;

  const uploadHandler = async (fileUpload: FileUpload): Promise<string> => {
    if (fileUpload.fieldName !== "file") {
      throw HttpAdapter.badRequest("Invalid field name");
    }

    const fileAdapter = new FileAdapter({
      awsAccessKeyId: environmentVariables.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: environmentVariables.AWS_SECRET_ACCESS_KEY,
      awsRegion: environmentVariables.AWS_REGION,
      awsS3Bucket: environmentVariables.AWS_S3_BUCKET,
      awsDomain: environmentVariables.AWS_DOMAIN,
      width,
      height,
      quality,
    });

    return await fileAdapter.uploadFile(fileUpload);
  };

  const formData = await parseFormData(request, uploadHandler);
  return { url: formData.get("file") };
}
```

- [ ] **Step 2: Verify types**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Expected: no errors related to `api.fileUpload.ts`.

---

### Task 3: Create `image-upload.tsx` component

**Files:**
- Create: `src/client/components/ui/image-upload.tsx`

**Interfaces:**
- Consumes: `FormErrorContext`, `FormFieldContext` from `./form-field`
- Consumes: `cn` from `~/client/lib/utils`
- Produces: `ImageUpload` named export; `ImageUploadProps` named export

```ts
type ImageUploadProps = {
  name: string;
  defaultValue?: string | null;
  width?: number;
  height?: number;
  reduceQuality?: number;
  disabled?: boolean;
};
```

- [ ] **Step 1: Create `src/client/components/ui/image-upload.tsx`**

```tsx
import { Image, Loader2, Upload } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { cn } from "~/client/lib/utils";
import { FormErrorContext, FormFieldContext } from "./form-field";

type ImageUploadProps = {
  name: string;
  defaultValue?: string | null;
  width?: number;
  height?: number;
  reduceQuality?: number;
  disabled?: boolean;
};

function ImageUpload({
  name,
  defaultValue,
  width,
  height,
  reduceQuality,
  disabled = false,
}: ImageUploadProps) {
  const fieldName = use(FormFieldContext);
  const fieldErrors = use(FormErrorContext);
  const hasFieldError = !!fieldErrors[fieldName]?.length;

  const [value, setValue] = useState(defaultValue ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  async function handleFile(file: File) {
    if (disabled || isLoading) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;

    const previousValue = value;
    const previousPreviewUrl = previewUrl;

    setPreviewUrl(localUrl);
    setIsLoading(true);
    setUploadError(null);

    try {
      const params = new URLSearchParams();
      if (width) params.set("w", String(width));
      if (height) params.set("h", String(height));
      if (reduceQuality) params.set("reduceQuality", String(reduceQuality));

      const queryString = params.toString();
      const uploadUrl = `/api/fileUpload${queryString ? `?${queryString}` : ""}`;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok || !data?.url) throw new Error("Upload falhou");

      setValue(data.url);
      setPreviewUrl(data.url);
      URL.revokeObjectURL(localUrl);
      objectUrlRef.current = null;
    } catch {
      URL.revokeObjectURL(localUrl);
      objectUrlRef.current = null;
      setValue(previousValue);
      setPreviewUrl(previousPreviewUrl);
      setUploadError("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (disabled || isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  const hasError = hasFieldError || !!uploadError;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input type="hidden" name={name} value={value} />

      <label
        aria-invalid={hasFieldError || undefined}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted transition-colors",
          !disabled && !isLoading && "hover:bg-muted/70",
          (disabled || isLoading) && "cursor-not-allowed opacity-70",
          hasError && "border-destructive",
          "group-data-invalid:border-destructive",
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || isLoading}
          onChange={handleInputChange}
        />

        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Enviando...</span>
          </div>
        )}

        {!isLoading && !previewUrl && (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <Image size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clique para enviar ou arraste aqui
            </span>
            <div className="pointer-events-none flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5">
              <Upload size={14} className="text-foreground" />
              <span className="text-xs font-semibold text-foreground">Selecionar</span>
            </div>
          </div>
        )}

        {!isLoading && previewUrl && (
          <>
            <img
              src={previewUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/40 py-3">
              <div className="pointer-events-none flex items-center gap-1.5 rounded-md border border-white/30 bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                <Upload size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">Alterar imagem</span>
              </div>
            </div>
          </>
        )}
      </label>

      {uploadError && (
        <p className="text-xs font-medium text-destructive">{uploadError}</p>
      )}
    </div>
  );
}

export { ImageUpload };
export type { ImageUploadProps };
```

- [ ] **Step 2: Verify types**

```bash
cd /var/www/testes/donation-react-router-v7 && npm run typecheck
```

Expected: no errors. If `React.ChangeEvent` or `React.DragEvent` cause issues, add `import type { ChangeEvent, DragEvent } from "react"` and replace the two occurrences.

- [ ] **Step 3: Smoke test in the browser**

Add the component to an existing page temporarily:

```tsx
// in any existing page (e.g. campaign general info), add:
import { ImageUpload } from "~/client/components/ui/image-upload";
import { FormField } from "~/client/components/ui/form-field";

// inside the JSX:
<FormField name="testImage" label="Teste de upload">
  <ImageUpload name="testImage" />
</FormField>
```

Start the dev server:

```bash
cd /var/www/testes/donation-react-router-v7 && npm run dev
```

Verify:
1. Drop zone renders with dashed border, icon, and "Selecionar" button
2. Clicking the area opens the OS file picker
3. Selecting an image shows the spinner briefly then the image preview
4. The "Alterar imagem" bar appears at the bottom of the preview
5. Selecting a different image replaces the preview
6. Dragging an image file onto the zone triggers upload
7. Wrapping in a FormField that has a server-side error (simulate by passing `fieldErrors={{ testImage: ["Imagem obrigatória"] }}` to `FormErrorProvider`) shows red border

- [ ] **Step 4: Remove the temporary smoke-test code** added in Step 3.
