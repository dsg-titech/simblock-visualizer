<template>
  <div>
    <v-btn v-if="!isRunning" fab small dark color="grey darken-2" @click="run">
      <v-icon>fas fa-play</v-icon>
    </v-btn>
    <v-btn v-else fab small dark color="grey darken-2" @click="stop">
      <v-icon>fas fa-pause</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "playButton",
  data: function() {
    return {
      isRunning: false
    };
  },
  methods: {
    run: function() {
      this.isRunning = true;
      this.$emit("run");
    },
    stop: function() {
      this.isRunning = false;
      this.$emit("stop");
    }
  }
};
</script>

<style></style>
