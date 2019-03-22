<template>
  <div
    id="globalMap"
    style="width: 100%; height: 100%"
    v-resize="onResize"
  ></div>
</template>

<script>
import Datamap from "datamaps";
import Manager from "@/js/Manager";

export default {
  name: "globalMap",
  data: function() {
    return {
      map: null,
      manager: null
    };
  },
  mounted: function() {
    this.map = new Datamap({
      element: this.$el,
      scope: "world",
      responsive: true
    });
    this.manager = new Manager(this.map);
  },
  methods: {
    onResize() {
      if (this.map !== null) {
        this.map.resize();
      }
    }
  }
};
</script>

<style scoped>
#globalMap {
  position: fixed;
  left: 0;
  top: 0;
  background: #202530;
}
</style>
