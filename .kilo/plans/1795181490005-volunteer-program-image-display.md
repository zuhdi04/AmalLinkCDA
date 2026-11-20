# Volunteer-Side Program Image Display

## Goal and boundaries

Surface the `imageDataUrl` field (written by the AmalLinkPWA admin app) on the volunteer-facing AmalLinkCDA site. This repo only reads the shared Firestore `projects` collection; it does not upload or resize images.

- Apply antislop **DURING** planning and implementation (session override).
- Read-only change: add `imageDataUrl` to the `Program` type and `mapProjectDoc`, then render it as a thumbnail in the two program list surfaces (Programs page rows and Home page cards).
- Preserve all routes, Firebase queries, registration payload/validation, sorting, and existing English copy. No Firestore rule or schema changes.
- The image is optional. Existing programs have no `imageDataUrl`, so the "no image" path is the common case and must not change current layout.

## Design direction

Reading this as: a public community program portal for prospective participants, in a calm, warm, trustworthy editorial style, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

Design reasons (R-31):

- A cropped **16:9** thumbnail gives program rows and home cards a consistent visual anchor without breaking the existing editorial scan rhythm. `object-cover` avoids distortion; the beige card border remains the frame. This mirrors the existing `CtaCard` image treatment (`aspect-[16/9]` + `object-cover` + `width="1000" height="563"`), so the new thumbnails match an established pattern rather than introduce a new one.
- Burgundy/green/sand tokens stay unchanged; no gradients, glass, glow, or decorative badges are added.
- Images are secondary to title/date/venue and the Register action; they never replace content or add a dead control.
- `alt` carries the program title so the image is meaningful to screen-reader users; it is omitted entirely (not rendered) when no image exists, avoiding an empty-decorative state.

## Data flow

1. Admin PWA (`AmalLinkPWA`, separate repo) writes `imageDataUrl` (a data-URL string) onto each `projects` doc via `setDoc` overwrite.
2. Volunteer site `fetchActivePrograms`/`fetchProgramById` already read the same collection; `mapProjectDoc` currently drops the field.
3. Add `imageDataUrl: (data.imageDataUrl as string) || ''` to `mapProjectDoc` and `imageDataUrl?: string` to the `Program` type. Both `ProgramsPage` and `HomePage` already receive full `Program` objects, so no page-level plumbing changes.

## Implementation tasks

1. **Extend the model**
   - `src/types/program.ts`: add `imageDataUrl?: string;` to `Program`.
   - `src/services/programService.ts` `mapProjectDoc`: add `imageDataUrl: (data.imageDataUrl as string) || ''`.

2. **Programs list rows** (`src/pages/ProgramsPage.tsx`)
   - Inside each `<article>`, when `program.imageDataUrl` is truthy, render a thumbnail at the top of the card. Follow the existing image convention from `src/components/CtaCard.tsx:12-14`: a wrapper `div` with `aspect-[16/9] overflow-hidden bg-beige`, an `<img>` with `h-full w-full object-cover`, `alt={program.title}`, `width="1000" height="563"`, and `loading="lazy"`.
   - Omit the `<img>` (and wrapper) entirely when `imageDataUrl` is empty. No placeholder box.

3. **Home page cards** (`src/pages/HomePage.tsx`)
   - Same treatment as Programs, mirroring `CtaCard`: a 16:9 cropped thumbnail at the top of each program card, only when `program.imageDataUrl` is truthy, `alt={program.title}`, `width="1000" height="563"`, `loading="lazy"`, `object-cover`.

4. **Accessibility and quality pass**
   - Verify alt text, no empty decorative images, focus/contrast unchanged, and no horizontal overflow at 320px with a wide image.
   - Confirm the thumbnail never blocks the Register action or clips at 200% zoom.

## Layout detail (Programs page)

The Programs `<article>` currently wraps a single `flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between` row (content left, Register button right). The thumbnail must sit **above** that flex row (full card width, 16:9), not inside it, so it does not fight the desktop content/Register layout. On Home the cards are already top-down (`flex flex-col`), so the thumbnail simply becomes the first child.

## Validation and delivery

- Run `npm run build` (tsc + vite) and resolve errors.
- Run the app; inspect console for errors.
- Click through: home program cards with/without image, Programs list with/without image, Register open/close/Escape, retry/refresh, News nav. Verify no broken layout when `imageDataUrl` is absent.
- Confirm with a project that has `imageDataUrl` set (real data if available, else a temporary local doc) that the thumbnail renders and crops correctly.
- Run the antislop core Delivery Gate plus UI/mobile/human checklists; record concrete click-through evidence.

## Explicitly out of scope

- Image upload, resize, or storage on this repo (owned by the admin PWA).
- Firestore schema, security rules, or registration contract changes.
- Rendering the image inside the Registration modal, news, or any other surface.
- New routes, dark mode, analytics, or marketing content.
