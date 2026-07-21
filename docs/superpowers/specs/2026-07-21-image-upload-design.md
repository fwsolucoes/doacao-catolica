# ImageUpload Component — Design Spec

**Date:** 2026-07-21  
**Branch:** img-component  
**Status:** Approved

---

## Overview

Recreate the `ImageUpload` component from the legacy `@arkyn/components` library using the current project's patterns (React Router v7, Tailwind v4, tailwind-variants, shadcn/ui). The component uploads immediately to S3 on file selection, stores the resulting URL in a hidden input for form submission, and integrates with `FormField` for error state display.

---

## Files Affected

| File | Action |
|------|--------|
| `src/client/components/ui/image-upload.tsx` | Create |
| `src/main/routes/api.fileUpload.ts` | Update — read `w`, `h`, `q` query params |
| `src/infra/adapters/fileAdapter.ts` | Update — process image with `sharp` |
| `package.json` | Add `sharp` dependency |

---

## Props API

```tsx
type ImageUploadProps = {
  name: string;
  defaultValue?: string | null;  // pre-fills preview with existing image URL
  width?: number;                 // passed as ?w= to upload endpoint
  height?: number;                // passed as ?h= to upload endpoint
  reduceQuality?: number;         // passed as ?q= (0–100) to upload endpoint
  disabled?: boolean;
};
```

### Usage

```tsx
// basic
<FormField name="image" label="Logo da instituição" required>
  <ImageUpload name="image" defaultValue={campaign.image} />
</FormField>

// with dimension/quality constraints
<FormField name="featuredImage" label="Imagem do banner (1400×733px)">
  <ImageUpload
    name="featuredImage"
    defaultValue={campaign.featuredImage}
    width={1400}
    height={733}
    reduceQuality={30}
  />
</FormField>
```

---

## Internal State

```ts
value: string          // URL stored in hidden input; initialized from defaultValue
previewUrl: string | null  // object URL for local preview OR defaultValue; revoked on unmount
isLoading: boolean     // true while fetch is in flight
uploadError: string | null  // local upload error (distinct from FormField server error)
```

---

## Visual States

### Empty (no image)
- Dashed border container
- Centered: image icon + "Clique para enviar ou arraste aqui" text + "Selecionar" button
- Hidden `<input type="file" accept="image/*">` triggered on click or drop

### Loading
- Same container with a centered spinner overlay
- All interactive elements disabled

### Has image
- Image fills the container as `object-cover`
- "Alterar imagem" button overlaid at the bottom
- Hidden file input triggered on button click

### Error (from FormField)
- Container border turns red via `group-data-[invalid]:border-(--destructive)`
- `aria-invalid` set on the wrapper div
- Error message is rendered by `FormField` (not by the component itself)

### Local upload error
- Reverts to previous preview (or empty state)
- Shows an inline error message below the container (separate from FormField's server error)

---

## FormField Integration

The component follows the same pattern as `Input`:

```tsx
import { use } from "react";
import { FormErrorContext, FormFieldContext } from "./form-field";

const fieldName = use(FormFieldContext);
const fieldErrors = use(FormErrorContext);
const hasError = !!fieldErrors[fieldName]?.length;
```

- `data-invalid` on the wrapper div triggers the red-border Tailwind variant
- `aria-invalid={hasError || undefined}` set on the wrapper for accessibility

---

## Upload Flow

1. User selects a file (click or drag-and-drop onto the drop zone)
2. `previewUrl = URL.createObjectURL(file)` — immediate local preview
3. `isLoading = true`
4. Build upload URL: `/api/fileUpload` + optional `?w=&h=&reduceQuality=` params
5. `fetch(uploadUrl, { method: 'POST', body: formData })` where `formData` has field `"file"`
6. **On success:** `value = response.url`, `isLoading = false`
7. **On error:** revert `previewUrl` to the previous stable value (`defaultValue` URL if set, otherwise `null`), set `uploadError`, `isLoading = false`
8. On unmount: revoke only object URLs created via `URL.createObjectURL` — never revoke the original `defaultValue` S3 URL

---

## Backend Changes

### `api.fileUpload.ts`
Read `w`, `h`, `q` from the request URL and forward to `FileAdapter`:

```ts
const url = new URL(request.url);
const width = url.searchParams.get("w") ? Number(url.searchParams.get("w")) : undefined;
const height = url.searchParams.get("h") ? Number(url.searchParams.get("h")) : undefined;
const quality = url.searchParams.get("reduceQuality") ? Number(url.searchParams.get("reduceQuality")) : undefined;
```

### `fileAdapter.ts`
Use `sharp` to process the image buffer before uploading to S3:
- Resize to `width` × `height` (if provided), using `fit: "cover"`
- Compress with `quality` (if provided) — applied to JPEG/WebP output
- Convert to the appropriate format based on the original MIME type

### Dependency
Add `sharp` to `package.json`. It is a native Node.js module with prebuilt binaries — no extra build configuration needed in most environments.

---

## Out of Scope

- Multiple file upload
- File type validation beyond `accept="image/*"`
- Client-side file size validation
- Removing an image (setting back to null/empty) — only change is supported
