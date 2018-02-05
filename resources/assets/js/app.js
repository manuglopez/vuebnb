import Vue from 'vue';
import App from './components/App.vue';
import router from './router.js';

var app = new Vue({
        el: '#app',
        render: h => h(App),
        router
    })
;
console.log('IN LIVE');