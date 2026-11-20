# AmalLink Home Clarity Redesign

## Goal and boundaries

Improve the clarity and usability of the AmalLink public portal, focused on the Home hero (value proposition) and CTA cards, while preserving the existing brand, routes, Firebase flow, and registration contract.

- Apply antislop **DURING** planning and implementation (session override).
- **Visual & UI only.** No Firebase schema, queries, security rules, or registration data contract changes. No new routes, no dark mode, no auth, no news backend.
- Preserve routes `/`, `/programs`, `/news`, all Firebase queries, registration submission, validation, and dynamic question behavior.
- Keep all UI copy in English.
- Remove the word "CDA" from all user-visible text; the product is now branded **AmalLink** only.
- Keep the existing burgundy/green/sand palette and Inter typography. Keep the two Unsplash CTA images, the three-item bottom navigation (mobile) and horizontal header nav (desktop), and the "Registration open" green status label.

## Design direction

Reading this as: a public community participation portal for prospective participants, in a calm, warm, trustworthy editorial style, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

The core problem being fixed: a first-time visitor does not understand what AmalLink does. The Home hero must state the value proposition plainly, then point to one clear action.

Design reasons (R-31):

- **Burgundy** stays the primary action/active-nav color; **green** the brand wordmark and genuine open/success state; **sand/cream** the warm community base. These are unchanged brand tokens, not decoration.
- **Inter** stays because readable program details and forms matter more than decorative type.
- The hero is rewritten to lead with a plain one-line value proposition ("community connector / find and join community programs") and a single primary action, removing the sidebar text block so the headline and CTA are the focal point.
- CTA cards are kept but their copy is tightened to be specific and honest (no fabricated counts or marketing claims).
- The wordmark and all visible text drop "CDA"; "AmalLink" reads as a single product name.

## Implementation tasks

1. **Rewrite the Home hero** (`src/pages/HomePage.tsx`)
   - Replace the headline/subtitle so a first-time visitor immediately understands AmalLink connects people to community programs and activities.
   - Keep `Browse open programs` as the primary CTA and its `/programs` destination.
   - Remove the right-side text block (currently `Program details, dates, venues, and registration questions...`) so the hero is a single focused headline + subtitle + CTA, not split by a competing secondary column.
   - Keep the heading hierarchy (single `h1`), real link behavior, and the burgundy primary action styling.

2. **Tighten CTA card copy** (`src/data/ctaItems.ts`)
   - Keep both cards (Programs, News), their `/programs` and `/news` routes, and their existing Unsplash images.
   - Rewrite `title`/`description`/`actionText` to be specific and honest, avoiding generic filler and any fabricated numbers or claims. Keep alt text accurate to the images.
   - No change to `CtaCard.tsx`/`CtaCardList.tsx` layout or image treatment unless a specific text-length issue forces a minor adjustment; report any such change.

3. **Rebrand visible text to "AmalLink"** (`PublicLayout.tsx`, `index.html`, PWA manifest, document titles)
   - Replace the header/footer wordmark "Amal**Link** CDA" with "Amal**Link**" only.
   - Update the logo `alt`/accessible name, footer tagline, document `<title>`, and any visible "CDA" strings across components and `index.html`.
   - Keep the logo SVG itself unchanged (visual asset not redesigned). Keep the brand color split (Amal burgundy / Link green).

4. **Accessibility and quality pass**
   - Verify the hero copy meets contrast (normal text 4.5:1, large text 3:1), the CTA is keyboard-reachable with a visible focus state, and the removed sidebar column does not leave an empty layout gap at desktop widths.
   - Confirm no horizontal overflow, no dead controls, and consistent heading levels after the copy changes.
   - Confirm "CDA" is absent from all user-visible strings while leaving file/folder/repo names (e.g. `AmalLinkCDA`) untouched.

## Validation and delivery

- Run `npm run build` and resolve TypeScript/Vite errors.
- Run the app and inspect the browser console.
- Click through: hero CTA -> `/programs`, both CTA cards -> `/programs` and `/news`, all desktop/mobile navigation, and confirm the wordmark reads "AmalLink" everywhere.
- Inspect at 320px, phone, tablet, and desktop widths; confirm the hero no longer shows an empty right column and nothing overflows.
- Run the antislop core Delivery Gate plus UI/mobile/human checklists; record concrete click-through evidence rather than an unsupported PASS.

## Explicitly out of scope

- Firebase schema, security rules, queries, or registration contract changes.
- New routes, dark mode, authentication, analytics, testimonials, or impact statistics.
- News backend/CMS integration.
- Redesigning or generating the logo or replacement brand assets.
- Renaming the repo/folder/package (`AmalLinkCDA`) or changing file paths.
