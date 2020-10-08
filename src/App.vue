<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  watch: {
    theme: function() {
      if (this.theme == "dark") document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    }
  },
  mounted() {
    if (this.theme == "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }
};
</script>

<style></style>
