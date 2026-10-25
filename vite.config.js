import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        vue(),
        laravel({
            // SCSS entry + Vue 3.5 entry (CSS real: original.css + design.css, importados en main.js)
            input: ['resources/assets/css/app.scss', 'resources/assets/js/main.js'],
            refresh: true,
        }),
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
