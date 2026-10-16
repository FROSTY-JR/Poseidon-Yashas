# Poseidon — Independent Branding Studio

A responsive branding-studio website with a scroll-driven 3D trident opening, an orbital artwork gallery, selected work, moving brand cards and rotating testimonials. The trident turns continuously and floats gently. The testimonial section stays pinned while scrolling advances through all three quotes; it also advances automatically while you pause scrolling. Scrolling upwards reverses the sequence.

## Run locally

Install Node.js 18 or later, open a terminal in this folder, and run:

```sh
npm run dev
```

Open http://127.0.0.1:4174. There are no npm dependencies to install and no build step. If that port is occupied, close the other preview or set the PORT environment variable to a different port.

## Edit the website

- `dist/index.html`: page content, sections, navigation and model attribution.
- `dist/style.css`, `dist/poseidon.css`, `dist/opening.css`: layouts, colours and responsive styling.
- `dist/app.js`: project dialogs, work scrolling, growth animation, testimonials and brief download.
- `dist/opening.js`: GLB loading, lighting and the scroll-driven 3D sequence.
- `dist/assets/`: website imagery and the optimised trident model.
- `dist/vendor/`: bundled Three.js 0.170.0 and its GLB loader.

## Update GitHub

After editing and checking the local preview:

```sh
git add .
git commit -m "Update Poseidon website"
git push origin main
```

This updates the repository. It does not automatically publish a website unless a hosting service has been connected separately.

## Host the website

Serve the contents of `dist/` with a static hosting provider. No build command is required. Use a web server for previews rather than opening index.html as a local file, because the 3D model uses JavaScript modules and browser asset loading.

The GitHub copy excludes private hosting configuration. The existing hosted preview is managed separately.

## Content and accessibility

Projects, names and testimonials are illustrative sample content. The enquiry form downloads a project brief; it does not send an email or store submissions. Replace sample content and connect a contact destination before a business launch.

The website honours reduced-motion settings. Devices without WebGL show an illustrated fallback. Navigation and native dialogs support keyboard interaction. Manrope and DM Sans load from Google Fonts with system fallbacks.

## Assets and licences

The trident is “Poseidon Trident – Mythic Ocean Weapon” by Pigcraft, supplied by the owner under CC BY 4.0. Its textures were resized from 2048px to 1024px; geometry is preserved. Attribution is included in the website footer and `ASSET-SOURCES.md`.

Three.js and its loader use the MIT licence included in `dist/vendor/THREE-LICENSE.txt`. The repository's root licence applies to original website code, not to third-party models, photographs or other separately licensed assets.

See `ASSET-SOURCES.md`, `ASSET-PROMPTS.md` and `POSEIDON-ASSET.md` for photography sources and generated-image prompts. User reference videos are not distributed with the website.

