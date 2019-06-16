<template>
  <v-app id="app">
    <world-map></world-map>
  </v-app>
</template>

<script>
import WorldMap from "./components/WorldMap.vue";

export default {
  name: "app",
  components: {
    WorldMap
  }
};
</script>

<style>
* {
  text-transform: none !important;
}
</style>
