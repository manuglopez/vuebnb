import { defineStore } from 'pinia';

export const useListingStore = defineStore('listing', {
    state: () => ({
        saved: [1, 15],
        listing_summaries: [],
        listings: []
    }),

    actions: {
        toggleSaved(id) {
            let index = this.saved.findIndex(saved => saved === id);
            if (index === -1) {
                this.saved.push(id);
            } else {
                this.saved.splice(index, 1);
            }
        },
        addData({route, data}) {
            if (route === 'listing') {
                this.listings.push(data.listing);
            } else {
                this.listing_summaries = data.listings;
            }
        }
    },

    getters: {
        getListing(state) {
            return id => state.listings.find(listing => Number(id) === listing.id);
        }
    }
});