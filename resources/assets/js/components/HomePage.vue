<template>
    <div class="home-container">
        <listing-summary-group
                v-for="(group, country) in listing_groups"
                :key="country"
                :listings="group"
                :country="country"
                class="listing-summary-group"
        ></listing-summary-group>
    </div>
</template>
<script>
    import {groupByCountry} from '../helpers';
    import axios from 'axios';




    let serverData = JSON.parse(window.server_data).listings;
    let listing_groups = groupByCountry(serverData);
    import ListingSummaryGroup from './ListingSummaryGroup.vue';

    export default {
        /*data() {
            return {
                //this.listing_groups: []
            };
        },
        methods:{
            assignData({ listings }) {
                this.listing_groups = groupByCountry(listings);
            },
        },*/
        computed: {
            listing_groups() {
                return groupByCountry(this.$store.state.listing_summaries);
            }
        },
        components: {
            ListingSummaryGroup
        },
        /*beforeRouteEnter(to, from, next) {
            let serverData = JSON.parse(window.server_data);
            if (to.path === serverData.path) {
                let listing_groups = groupByCountry(serverData.listings);
                next(component => component.listing_groups = listing_groups);
            } else {
                axios.get(`/api/`).then(({ data }) => {
                    let listing_groups = groupByCountry(data);
                    console.log(data);
                    next(component => component.listing_groups = listing_groups);
                });
            }
        }*/
    }
</script>