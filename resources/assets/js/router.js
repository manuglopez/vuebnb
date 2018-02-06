import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);


import ListingPage from './components/ListingPage.vue';
import HomePage from './components/HomePage.vue';
import SavedPage from './components/SavedPage.vue'
import axios from 'axios';
import store from './store';

let router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: HomePage, name: 'home'},
        {path: '/saved', component: SavedPage, name: 'saved'},
        {path: '/listing/:listing', component: ListingPage, name: 'listing'}
    ],
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    },

});
router.beforeEach((to, from, next) => {
    let serverData = JSON.parse(window.server_data);
    if (
        to.name === 'listing'
            ? store.getters.getListing(to.params.listing)
            : store.state.listing_summaries.length > 0
    ) {
        next();
    }
    else if (!serverData.path || to.path !== serverData.path) {
        axios.get(`/api${to.path}`).then(({data}) => {
            store.commit('addData', {route: to.name, data});
            next();
        });
    }
    else {
        store.commit('addData', {route: to.name, data: serverData});
        next();
    }
});

export default router;