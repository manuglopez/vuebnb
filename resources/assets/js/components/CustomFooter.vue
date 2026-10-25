<template>
    <div id="footer">
        <div class="hr"></div>
        <div :class="containerClass">
            <p>
                <span><strong>Vuebnb</strong>. A full-stack Vue.js and Laravel demo app</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const containerClass = computed(() => {
    return `${window.location.pathname === '/' ? 'home' : 'listing'}-container`;
});
</script>

<style>
#footer {
    margin-bottom: 3em;
}

#footer .icon {
    height: 23px;
    display: inline-block;
    margin-bottom: -6px;
}

.hr {
    border-bottom: 1px solid #dbdbdb;
    margin: 3em 0;
}

#footer p {
    font-size: 15px;
    color: #767676 !important;
    display: flex;
}

#footer p img {
    padding-right: 6px;
}
</style>