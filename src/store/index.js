import Vue from "vue";
import Vuex from "vuex";

import gateway from "./gateway";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    gateway
  }
});

export default store;
