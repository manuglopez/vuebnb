import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        vue(),
        laravel({
            // SCSS entry (Tailwind + global styles) + Vue 3.5 entry
            input: ['resources/assets/css/app.scss', 'resources/assets/js/main.js'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
        // Copy listing images to public/images during build (for php artisan serve)
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/assets/images/**/*',
                    dest: '../images',
                },
            ],
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
