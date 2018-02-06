<template>
    <div>
        <header-image
                v-if="listing.images[0]"
                :image-url="listing.images[0]"
                :id="listing.id"
                @header-clicked="openModal"
        ></header-image>
        <div class="listing-container">
            <div class="heading">
                <h1>{{ listing.title }}</h1>
                <p>{{ listing.address }}</p>
            </div>
            <hr>
            <div class="about">
                <h3>About this listing</h3>
                <expandable-text>{{ listing.about }}</expandable-text>
            </div>
            <div class="lists">
                <feature-list title="Amenities" :items="listing.amenities">
                    <template slot-scope="amenity">
                        <i class="fa fa-lg" :class="amenity.icon"></i>
                        <span>{{ amenity.title }}</span>
                    </template>
                </feature-list>
                <feature-list title="Prices" :items="listing.prices">
                    <template slot-scope="price">
                        {{ price.title }}: <strong>{{ price.value }}</strong>
                    </template>
                </feature-list>
            </div>
        </div>
        <modal-window ref="imagemodal">
            <image-carousel :images="listing.images"></image-carousel>
        </modal-window>
    </div>
</template>
<script>
    import { populateAmenitiesAndPrices } from '../helpers';
    let model = populateAmenitiesAndPrices(state);
    var state = JSON.parse(window.server_data).listing;

    import ImageCarousel from './ImageCarousel.vue';
    import ModalWindow from './ModalWindow.vue';
    import FeatureList from './FeatureList.vue';
    import HeaderImage from './HeaderImage.vue';
    import ExpandableText from './ExpandableText.vue';

    export default {

        data() {
            return {
                id:null,
                title: null,
                about: null,
                address: null,
                amenities: [],
                prices: [],
                images: []
            }
        },
        components: {
            ImageCarousel,
            ModalWindow,
            FeatureList,
            HeaderImage,
            ExpandableText
        },
        computed:{
            listing() {
                return populateAmenitiesAndPrices(this.$store.getters.getListing(this.$route.params.listing));
            }
        },
        methods: {
            assignData({ listing }) {
                Object.assign(this.$data, populateAmenitiesAndPrices(listing));
            },
            openModal() {
                this.$refs.imagemodal.modalOpen = true;
            }
        }
    }
</script>
<style>
    .about {
        margin: 2em 0;
    }

    .about h3 {
        font-size: 22px;
    }
</style>