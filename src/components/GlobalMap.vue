<template>
  <div>
    <canvas id="mapCanvas" ref="mapCanvas" v-resize="onResize"></canvas>
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
                      <v-btn
                        v-if="!isRunning"
                        fab
                        small
                        dark
                        color="grey darken-2"
                        @click="run"
                      >
                        <v-icon>fas fa-play</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        fab
                        small
                        dark
                        color="grey darken-2"
                        @click="stop"
                      >
                        <v-icon>fas fa-pause</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-slider
                    v-model="step"
                    :min="minStep"
                    :max="maxStep"
                    always-dirty
                    color="grey darken-2"
                    thumb-size="48"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        small
                        color="grey darken-2"
                        @click="decrementStep"
                        class="mr-1"
                      >
                        fas fa-minus
                      </v-icon>
                    </template>
                    <template v-slot:append>
                      <v-icon
                        small
                        color="grey darken-2"
                        @click="incrementStep"
                        class="ml-1"
                      >
                        fas fa-plus
                      </v-icon>
                    </template>
                  </v-slider>
                  <upload-btn title="UPLOAD" :fileChangedCallback="fileChanged">
                  </upload-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-snackbar
              v-model="snackbar"
              bottom
              right
              :timeout="3000"
              :color="loadSuccess ? 'success' : 'error'"
            >
              <span subheading>
                Load {{ loadSuccess ? "Success" : "Failure" }}
              </span>
              <v-btn icon small @click="snackbar = false">
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </v-snackbar>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Manager from "@/js/Manager";
import UploadButton from "vuetify-upload-button";

let manager;

export default {
  name: "globalMap",
  data: function() {
    return {
      ctx: null,
      step: 0,
      minStep: 0,
      maxStep: 0,
      timestamp: 0,
      isRunning: false,
      reader: new FileReader(),
      snackbar: false,
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
    setInterval(() => {
      if (!this.isRunning) return;
      this.incrementStep();
    }, 33);
    this.reader.onload = event => {
      const dynamicData = JSON.parse(event.target.result);
      const success = manager.loadDynamicData(dynamicData);
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
    run() {
      this.isRunning = true;
    },
    stop() {
      this.isRunning = false;
    },
    incrementStep() {
      if (this.step === this.maxStep) {
        this.step = this.minStep;
      } else {
        this.step++;
      }
    },
    decrementStep() {
      if (this.step === this.minStep) {
        this.step = this.maxStep;
      } else {
        this.step--;
      }
    },
    onResize() {
      if (this.ctx === null) return;
      this.resizeCanvas();
    },
    resizeCanvas() {
      this.ctx.canvas.width = window.innerWidth;
      this.ctx.canvas.height = window.innerHeight;
    },
    fileChanged(file) {
      if (file === null) return;
      if (file.type !== "application/json") {
        this.showLoadStatus(false);
        return;
      }
      this.reader.readAsText(file);
    },
    showLoadStatus(success) {
      this.loadSuccess = success;
      this.snackbar = true;
    }
  },
  components: {
    "upload-btn": UploadButton
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
