import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import { useListingStore } from './store';
import axios from 'axios';

import ListingPage from './components/ListingPage.vue';
import HomePage from './components/HomePage.vue';
import SavedPage from './components/SavedPage.vue';


const routes = [
    {path: '/', component: HomePage, name: 'home'},
    {path: '/saved', component: SavedPage, name: 'saved'},
    {path: '/listing/:listing', component: ListingPage, name: 'listing'}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || {top: 0};
    },
});

router.beforeEach(async (to, from, next) => {
    const listingStore = useListingStore();
    try {
        let serverData = {};
        if (window.server_data) {
            serverData = JSON.parse(window.server_data);
        }
        
        const isListingRoute = to.name === 'listing';
        const hasListingData = isListingRoute 
            ? listingStore.getListing(to.params.listing)
            : listingStore.listing_summaries.length > 0;
            
        if (hasListingData) {
            next();
        } else if (!serverData.path || to.path !== serverData.path) {
            const response = await axios.get(`/api${to.path}`);
            if (isListingRoute) {
                listingStore.addData({route: to.name, data: response.data});
            } else {
                listingStore.addData({route: to.name, data: response.data});
            }
            next();
        } else {
            if (isListingRoute) {
                listingStore.addData({route: to.name, data: serverData});
            } else {
                listingStore.addData({route: to.name, data: serverData});
            }
            next();
        }
    } catch (error) {
        console.error('Router guard error:', error);
        next();
    }
});

export default router;