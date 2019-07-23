<template>
  <div>
    <canvas id="mapCanvas" ref="mapCanvas"></canvas>
    <v-container
      fill-height
      fluid
      style="position: fixed; pointer-events: none; z-index: 1;"
    >
      <v-layout fill-height column>
        <v-spacer></v-spacer>
        <v-flex xs2>
          <v-card
            color="rgba(255, 255, 255, 0.5)"
            style="pointer-events: initial;"
          >
            <v-container grid-list-xl text-xs-center>
              <v-layout row>
                <v-flex xs8 offset-xs2>
                  <v-layout justify-space-between mb-3>
                    <v-flex text-xs-left>
                      <span class="display-1 font-weight-light">
                        timestamp: <span v-text="timestamp"></span>
                      </span>
                    </v-flex>
                    <v-flex text-xs-right>
                      <play-button @run="run" @stop="stop"></play-button>
                    </v-flex>
                  </v-layout>
                  <timestamp-slider
                    v-model="step"
                    :minStep="0"
                    :maxStep="maxStep"
                    :isRunning="isRunning"
                  >
                  </timestamp-slider>
                  <upload-button
                    title="UPLOAD"
                    @file-update="updateFile"
                    :noTitleUpdate="true"
                  >
                  </upload-button>
                </v-flex>
              </v-layout>
            </v-container>
            <load-status-snackbar
              v-model="snackbarVisible"
              :loadSuccess="loadSuccess"
            >
            </load-status-snackbar>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Manager from "@/js/Manager";
import UploadButton from "vuetify-upload-button";
import TimestampSlider from "@/components/TimestampSlider.vue";
import PlayButton from "@/components/PlayButton.vue";
import LoadStatusSnackbar from "@/components/LoadStatusSnackbar.vue";

let manager;

export default {
  name: "worldMap",
  data: function() {
    return {
      ctx: null,
      step: 0,
      maxStep: 0,
      timestamp: 0,
      isRunning: false,
      reader: new FileReader(),
      snackbarVisible: false,
      loadSuccess: true
    };
  },
  mounted: function() {
    this.ctx = this.$refs.mapCanvas.getContext("2d");
    this.resizeCanvas();
    manager = new Manager(this.ctx);
    this.maxStep = manager.timestamps.length - 1;
    manager.updateTimeStep(this.step);
    manager.setLoadCallback(() => (this.step = 0));
    manager.run();
    this.reader.onload = event => {
      const dynamicData = JSON.parse(event.target.result);
      const success = manager.loadDynamicData(dynamicData);
      if (success) {
        this.maxStep = manager.timestamps.length - 1;
      }
      this.showLoadStatus(success);
    };
  },
  watch: {
    step: function(val) {
      manager.updateTimeStep(val);
      this.timestamp = manager.getTimestamp();
    }
  },
  methods: {
    run: function() {
      this.isRunning = true;
    },
    stop: function() {
      this.isRunning = false;
    },
    // onResize: function() {
    //   if (this.ctx === null) return;
    //   this.resizeCanvas();
    // },
    resizeCanvas: function() {
      this.ctx.canvas.width = document.body.clientWidth;
      this.ctx.canvas.height = document.body.clientHeight;
    },
    updateFile: function(file) {
      if (file === null) return;
      if (file.type !== "application/json") {
        this.showLoadStatus(false);
        return;
      }
      this.reader.readAsText(file);
    },
    showLoadStatus: function(success) {
      this.loadSuccess = success;
      this.snackbarVisible = true;
    }
  },
  components: {
    UploadButton,
    TimestampSlider,
    PlayButton,
    LoadStatusSnackbar
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
.leaflet-grab {
  cursor: default !important;
}
</style>
