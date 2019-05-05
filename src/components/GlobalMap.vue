<template>
  <div>
    <canvas id="mapCanvas" ref="mapCanvas" v-resize="onResize"></canvas>
    <v-container
      fill-height
      style="position: fixed; pointer-events: none; z-index: 1;"
    >
      <v-layout fill-height column>
        <v-spacer></v-spacer>
        <v-flex xs2>
          <v-container grid-list-xl text-xs-center>
            <v-layout row>
              <v-flex xs8 offset-xs2>
                <v-slider
                  v-model="step"
                  :min="minStep"
                  :max="maxStep"
                  thumb-label="always"
                  always-dirty
                  style="pointer-events: initial;"
                ></v-slider>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Manager from "@/js/Manager";

let manager;

export default {
  name: "globalMap",
  data: function() {
    return {
      ctx: null,
      step: 0,
      minStep: 0,
      maxStep: 0
    };
  },
  mounted: function() {
    this.ctx = this.$refs.mapCanvas.getContext("2d");
    this.resizeCanvas();
    manager = new Manager(this.ctx);
    this.maxStep = manager.timestamps.length - 1;

    manager.run();
  },
  watch: {
    step: function(val) {
      manager.updateTimeStep(val);
    }
  },
  methods: {
    onResize() {
      if (this.ctx === null) return;
      this.resizeCanvas();
    },
    resizeCanvas() {
      this.ctx.canvas.width = window.innerWidth;
      this.ctx.canvas.height = window.innerHeight;
    }
  }
};
</script>

<style>
#mapCanvas {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
}
.leaflet-container {
  z-index: 0;
}
</style>
