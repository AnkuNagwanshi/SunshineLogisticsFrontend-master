import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset,
  images: ['public/Sunshine_logo_black.png'],
  headLinkOptions: {
    preset: '2023',
  },
})
