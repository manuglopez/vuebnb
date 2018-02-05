import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);


import ListingPage from './components/ListingPage.vue';
import HomePage from './components/HomePage.vue';

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: HomePage, name:'home' },
        { path: '/listing/:listing', component: ListingPage , name:'listing'}
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});