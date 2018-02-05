import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        saved: []
    },

    mutations: {
        toggleSaved(state, id) {
            let index = state.saved.findIndex(saved => saved === id);
            if (index === -1) {
                state.saved.push(id);
            } else {
                state.saved.splice(index, 1);
            }
        }
    }
});