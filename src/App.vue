<template>
  <v-app id="app">
    <global-map></global-map>
  </v-app>
</template>

<script>
import GlobalMap from "./components/GlobalMap.vue";

export default {
  name: "app",
  components: {
    GlobalMap
  }
};
</script>

<style></style>
