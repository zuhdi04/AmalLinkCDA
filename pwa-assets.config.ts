import { defineConfig, minimalPreset } from '@vite-pwa/assets-generator/config';

const background = '#F7F4EE';
const resizeOptions = { background };

export default defineConfig({
  preset: {
    ...minimalPreset,
    transparent: { sizes: [192, 512], padding: 0.2, resizeOptions },
    maskable: { sizes: [512], padding: 0.2, resizeOptions },
    apple: { sizes: [180], padding: 0.2, resizeOptions },
  },
  images: ['public/icons/amallink-logo.svg'],
  headLinkOptions: { basePath: '/icons/' },
});
