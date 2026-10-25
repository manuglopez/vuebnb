<template>
    <div class="listing-save" @click.stop="toggleSaved()">
        <button v-if="button">
            <i :class="classes"></i>
            {{ message }}
        </button>
        <i v-else :class="classes"></i>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useListingStore } from '../store';

const props = defineProps(['id', 'button']);
const listingStore = useListingStore();

const isListingSaved = computed(() => {
    return listingStore.saved.find(saved => saved === props.id);
});

const message = computed(() => {
    return isListingSaved.value ? 'Saved' : 'Save';
});

const classes = computed(() => {
    let saved = isListingSaved.value;
    return {
        'fa': true,
        'fa-lg': true,
        'fa-heart': saved,
        'fa-heart-o': !saved
    }
});

const toggleSaved = () => {
    listingStore.toggleSaved(props.id);
};
</script>

<style>
    .listing-save {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }

    .listing-save .fa-heart-o {
        color: #ffffff;
    }

    .listing-save .fa-heart {
        color: #ff5a5f;
    }

    .listing-save button .fa-heart-o {
        color: #808080;
    }

    .listing-save i {
        padding-right: 4px;
    }

</style>