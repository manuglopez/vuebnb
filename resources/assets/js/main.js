import '../css/original.css';
import { createApp } from 'vue';
import App from './components/App.vue';
import router from './router.js';
import { createPinia } from 'pinia';
import '../css/design.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
