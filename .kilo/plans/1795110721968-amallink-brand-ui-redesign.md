# AmalLinkCDA Brand UI Redesign

## Goal and boundaries

Redesign the public AmalLinkCDA interface to share the visual identity of `C:\Users\azibf\Desktop\AKASE\New folder\AmalLinkPWA`: burgundy, green, sand/cream surfaces, Inter typography, and the existing AmalLink network logo.

- Apply antislop **during** planning and implementation (session override).
- Change UI, visual hierarchy, responsiveness, accessibility, and theme only.
- Preserve routes `/`, `/programs`, and `/news`, Firebase queries, registration submission, validation, and dynamic question behavior.
- Keep all UI copy in English.
- Do not introduce dark mode, authentication, a news backend, or new application features.
- Replace the two fabricated News entries with an honest empty state, as approved. Keep the News page and navigation destination.

## Design direction

Reading this as: a public community program portal for prospective participants, in a calm, warm, trustworthy editorial style, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

Design reasons (R-31):

- **Burgundy** is the established primary brand/action color; **green** identifies the brand wordmark and genuine open/success states; **sand/cream** supplies a warm community-oriented base.
- **Inter** matches the existing AmalLink product family and keeps program details and forms readable.
- A shared public header and compact mobile menu make the three existing destinations consistently reachable without adding dead links.
- The homepage gives open programs the strongest content hierarchy; secondary Program and News links support exploration without competing with registration.
- Program pages use clear information rows rather than decorative dashboard patterns. Registration remains the primary action.
- Motion is limited to purposeful hover, focus, and menu/modal transitions; reduced-motion preferences are respected.

## Implementation tasks

1. **Establish the brand foundation**
   - In `src/index.css`, define Tailwind v4 theme tokens for the PWA palette: burgundy `#7A1E3A`, burgundy dark `#63152D`, burgundy light `#FDF2F4`, green `#1E5E3A`, green dark `#16482C`, green light `#EBF7EE`, sand `#F7F4EE`, sand dark `#EFE9DE`, cream `#FAF7F2`, beige `#F5EBE1`, and beige dark `#EADCCE`.
   - Configure Inter with system fallbacks and a restrained shared radius/shadow scale matching the PWA. Avoid gradients, glass effects, glow, decorative grids, and page-wide shadows.
   - Add global pointer/not-allowed cursors, visible high-contrast `:focus-visible` treatment, readable body defaults, and reduced-motion handling.
   - Update `index.html` with the sand/cream base, brand favicon, and appropriate existing document identity.

2. **Reuse the approved logo without redesigning it**
   - Copy the source `public/icons/amallink-logo.svg` from AmalLinkPWA into AmalLinkCDA as a local public asset; do not alter its shapes or colors.
   - Use the SVG in shared header/footer branding and as the favicon. Give informative logo images suitable alt text and intrinsic dimensions; purely decorative repetitions use empty alt text.

3. **Create one shared public site shell**
   - Add a small layout component used by all three pages, containing the AmalLink wordmark (`Amal` burgundy, `Link` green), navigation to Home, Programs, and News, and active-route indication using `NavLink`/`aria-current`.
   - Desktop: compact horizontal navigation. Mobile: an explicitly labelled Menu button with a real open/close state, keyboard support, at least 44px targets, and no squeezed desktop row. Close the menu after navigation and on Escape.
   - Use semantic header/nav/main/footer structure, one page-level h1 per page, and a concise footer containing only real destinations and brand information. No invented partnership or impact claims.
   - Keep the existing React Router setup and all routes unchanged.

4. **Redesign the homepage around real participation tasks**
   - Replace the blue centered template hero with a warm editorial introduction and a specific primary link to browse programs. Do not add a pill above the h1, invented statistics, or decorative status dots.
   - Show a branded loading message while homepage programs load; retain a useful error/retry state instead of silently swallowing fetch failures; show an honest empty state with a link to the full Programs page when none are open.
   - Present up to three real active programs with title, date, venue when available, and registration navigation. Use responsive stacking and fluid content, with no horizontal overflow.
   - Rework `CtaCard`/`CtaCardList` and `ctaItems` into calmer branded destination panels. Preserve the real `/programs` and `/news` links and existing Unsplash images, but add explicit image dimensions/aspect ratios and remove generic CTA wording where necessary. Keep overlay text contrast safe across the complete image area and disable non-essential image motion for reduced motion.

5. **Redesign Programs and its data states**
   - Replace blue/slate styling with the shared shell and AmalLink tokens. Keep the current program-fetching logic, sorting, and display fields.
   - Make each program's title, real open status, date/venue, optional budget/notes, and Register action easy to scan. Use green only for real open/success status; burgundy for primary actions.
   - Preserve loading, error/retry, and empty states, but align their appearance and messaging with the brand. All controls retain real behavior and 44px minimum targets.

6. **Restyle the registration dialog and form**
   - Apply cream/sand surfaces, branded primary submit action, readable field labels, consistent input boundaries, and visible focus states to `RegistrationModal`.
   - Preserve every field type, validation message, question fetch, submission payload, success result, Escape handling, and close behavior.
   - Ensure small screens use a reachable scrollable dialog/sheet layout with safe padding, no clipped controls, and inputs that can scroll above the mobile keyboard. Keep accessible names and 44px controls.

7. **Make News honest and visually consistent**
   - Remove the two hard-coded sample articles from `NewsPage.tsx` and replace them with a clear empty state explaining that no news updates are currently published.
   - Keep the page title, introductory context, and real navigation. Do not fabricate replacement news, dates, statistics, or a nonfunctional subscription control.

8. **Accessibility and quality pass**
   - Check every changed text/background pair with the antislop contrast checker; normal text must meet 4.5:1 and large text 3:1. Verify component boundaries and focus indicators against adjacent colors at 3:1.
   - Confirm semantic buttons/links, accessible names, alt text, visible labels, keyboard operation, focus visibility, pointer cursors, and reduced-motion behavior.
   - Verify layout at narrow phone, tablet, and desktop widths, including 200% zoom, long program content, all loading/empty/error/success states, mobile navigation, and dialog scrolling. No horizontal overflow or bottom/fixed chrome covering content.

## Validation and delivery

- Run `npm run build` and resolve TypeScript or Vite errors.
- Run the app and inspect the browser console.
- Record a click-through of every control: all desktop/mobile navigation links, menu open/close/Escape, homepage program links, program registration open/close/Escape, required-field validation, dynamic fields where data exists, submit success or real Firebase error, retry/refresh, and News/Home navigation.
- Exercise mobile and desktop breakpoints and all available data states; do not claim submission success unless verified against real Firebase behavior.
- Run the antislop core Delivery Gate plus UI, layout/mobile, and human checklists. Any FAIL must be fixed before delivery. Report visual/performance measurements only if actually measured.

## Explicitly out of scope

- Firebase schema, security rules, queries, and registration data contract changes.
- News backend/CMS integration or publication workflow.
- New routes, accounts, analytics, testimonials, impact statistics, or marketing claims.
- Redesigning or generating a replacement logo.
