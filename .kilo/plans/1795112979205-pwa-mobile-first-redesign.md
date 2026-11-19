# AmalLinkCDA PWA and Mobile-First Redesign

## Goal and boundaries

Convert the existing React 19, Vite 6, Tailwind CSS 4, and Firebase public portal into an installable PWA and redesign its shell for comfortable mobile use first, then tablet and desktop.

- Apply antislop **DURING** planning and implementation, selected for this session.
- Preserve routes `/`, `/programs`, and `/news`, Firebase configuration, program queries, registration payload, validation, dynamic questions, and all existing English UI copy language.
- Keep the existing Home, Programs, and News destinations. Do not add accounts, a news backend, dark mode, analytics, or unrelated features.
- PWA scope is an offline application shell, local icons, and cached static assets. Fresh program data and registration submission still require internet; do not add offline registration or background submission.
- Use the existing AmalLink logo, with owner approval, to generate install icons without redesigning its shapes or colors.

## Design direction

Reading this as: a public community participation app for prospective participants, in a calm, warm, trustworthy visual language, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

Major design reasons (R-31):

- Keep burgundy for primary actions and active navigation, green for genuine open/success states, and sand/cream surfaces for continuity with AmalLink.
- Keep Inter with system fallbacks because readable program details and forms matter more than decorative typography.
- Mobile uses a compact top identity bar and a fixed three-item bottom navigation so every real destination is reachable by thumb. Desktop retains a compact horizontal header navigation.
- One dominant action per view: browse/register for programs. Avoid invented metrics, decorative badges, gradients, glass, glow, background grids, and animation loops.
- Use simple relevant navigation glyphs for Home, Programs/calendar, and News/newspaper, always paired with visible labels. Motion is limited to state feedback and sheet transitions, with reduced-motion support.

## Implementation tasks

### 1. Add the PWA foundation

- Add and configure `vite-plugin-pwa` in `vite.config.ts`, using generated service-worker support and an update prompt rather than forcing a reload while a user may be completing the registration form.
- Configure the web manifest with the AmalLink CDA name, short name, description, `/` start URL, `standalone` display, sand background/theme colors, and the approved logo icons.
- Generate local PNG icons at 192x192 and 512x512 plus a maskable icon with sufficient safe-zone padding and a cream/sand background. Add an Apple touch icon. Retain the existing SVG favicon.
- Register the service worker from the React entry point through the plugin's virtual module. Ensure development behavior does not leave stale service workers interfering with normal iteration; validate the actual service worker with a production build and preview.
- Update `index.html` with manifest/PWA metadata supplied by the plugin, existing theme color, apple mobile web app metadata where needed, and zoom-safe viewport settings.

### 2. Define safe caching and offline behavior

- Precache the application shell, built JS/CSS, local icons, and other local static assets required to launch installed routes.
- Use a navigation fallback to `index.html` so direct launches of `/programs` and `/news` open the shell when offline.
- Do not precache or runtime-cache Firestore/API responses as authoritative content. Do not queue registrations. Firebase requests must continue to fail visibly when unavailable.
- If retaining the current remote Unsplash destination images, use a bounded, expiring runtime image cache that accepts valid basic and opaque image responses. The app must remain usable when these images are unavailable.
- Add a concise online/offline status indicator with an appropriate live-region announcement. Offline messaging must say that program freshness and registration require a connection, not imply that cached program data exists.
- Show a nonblocking app-update prompt with working Update and Dismiss actions. Update activates the new worker and reloads only after explicit user action; Dismiss leaves the current app usable. Position it above the bottom navigation and safe-area inset on mobile.

### 3. Rebuild the responsive application shell

- Update `PublicLayout` into the shared installed-app and browser shell. Preserve the skip link, semantic landmarks, route-based active states, and logo link.
- Mobile: compact sticky header with the approved logo and wordmark, no hamburger for only three destinations, and a fixed bottom navigation for Home, Programs, and News. Each target is at least 44x44px with spacing, icon plus label, and `aria-current` through `NavLink`.
- Reserve bottom-nav height using padding and `env(safe-area-inset-bottom)` so the final content, form actions, status messages, and update prompt are never covered. Use `100dvh` where viewport sizing is necessary.
- Tablet: preserve readable content widths and prevent an overly stretched phone stack. Desktop: use horizontal header navigation and remove mobile-only bottom chrome; do not introduce an unnecessary dashboard sidebar.
- Keep the footer useful and concise, ensuring fixed navigation never covers it. Use native links/buttons, visible focus states, pointer cursors, and no dead controls.

### 4. Redesign the three pages around mobile tasks

- **Home:** retain the editorial introduction and real program data, but tighten mobile type, spacing, and action sizing. Make the primary browse action easy to reach. Present open programs as a single-column scan-friendly list on phones, two columns when content fits, and three on sufficiently wide desktop screens.
- Keep real title, open status, date, and venue; avoid fabricated summaries or stats. Preserve branded loading, actionable error/retry, and honest empty states. Consolidate duplicate homepage fetch entry points only if needed to make retry and initial loading consistent, without changing the Firebase contract.
- Rework destination cards only as needed for the new hierarchy. Preserve real links and image alt text, reserve image space, and ensure remote-image failure does not break navigation.
- **Programs:** use compact page introduction and scan-friendly program rows/cards. Put title, date, venue, and Register in a predictable order; keep optional budget/notes only when real values exist. On phones use full-width, minimum-44px Register actions; on wider screens align actions without squeezing content.
- Preserve all existing loading, error/retry, and empty states and ensure offline failures explain the next action.
- **News:** retain the honest empty state and working Programs link. Apply the same responsive page rhythm without inventing articles, subscriptions, or notification controls.

### 5. Make registration mobile-first

- Restyle `RegistrationModal` as a bottom sheet on narrow screens and a centered dialog on larger screens, retaining native dialog semantics, focus trap, initial focus, Escape close, backdrop close, and focus restoration.
- Use `dvh` limits, safe-area padding, a reachable scrollable body, and sticky sheet actions where helpful. Ensure the submit/cancel controls and success action remain reachable above the bottom browser or device UI.
- Keep visible labels, appropriate autocomplete/input types, dynamic question types, required-field validation, real error messages, submitting state, and success confirmation unchanged in behavior.
- Ensure focused inputs can scroll above the on-screen keyboard, text can resize without clipping, and controls remain at least 44px. No horizontal overflow at 320px or 200% zoom.

### 6. Accessibility, performance, and installation polish

- Check all new text/background and state color pairs with `.agents/skills/antislop-human/contrast-check.py`: normal text 4.5:1, large text and component/focus boundaries 3:1.
- Keep `lang`, unique title, landmarks, one page-level h1, visible labels, image alt text and dimensions, accessible names for icon controls, logical tab order, and reduced-motion behavior.
- Give every enabled control `cursor: pointer`, distinct hover/active/disabled states, and real behavior. Avoid decorative emoji and generic CTA wording.
- Do not add third-party render-blocking scripts. Do not report Lighthouse or Web Vitals numbers unless actually measured.
- No `AGENTS.md` currently exists; do not create unrelated project documentation.

## Validation and delivery

1. Run `npm run build` and resolve TypeScript/Vite/PWA generation errors. Serve the production build with `npm run preview` for service-worker checks.
2. Inspect desktop and mobile browser consoles. Confirm the manifest loads, icons are valid, service worker activates, and the app meets browser installability requirements.
3. Test install/launch where browser tooling permits. Verify standalone display, `/` start URL, and direct `/programs` and `/news` launches. Clearly report any platform installation behavior that cannot be exercised locally.
4. Test offline after one successful online load: shell, navigation, local icons, and cached images behave as designed; program loading and registration fail honestly with retry guidance and no fake success. Restore connectivity and verify recovery.
5. Test the update flow with two distinguishable production builds if practical: Dismiss keeps the current version; Update activates and reloads only after confirmation.
6. Click through every interactive element: all desktop/mobile navigation, skip link, Home program links, Register open/close/backdrop/Escape, field validation, dynamic fields where available, submit success or real Firebase error, retry/refresh, News link, offline indicator, and Update/Dismiss when present.
7. Inspect at 320px, common phone widths, tablet/small laptop, and desktop, plus 200% zoom and long content. Confirm no horizontal overflow, clipped text, undersized targets, bottom-nav overlap, or keyboard-hidden form controls.
8. Run the antislop core Delivery Gate and UI, mobile-layout, and human checklists. Any FAIL must be fixed before delivery; record concrete click-through evidence rather than an unsupported PASS.

## Explicitly out of scope

- Offline Firestore data, saved registration drafts, background sync, push notifications, or retry queues.
- Firebase schema/security-rule changes, native app store packaging, authentication, or new routes.
- Redesigning the logo, adding screenshots or marketing assets, or fabricating installation/usage claims.
