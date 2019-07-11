<template>
  <v-slider
    :value="value"
    @input="$emit('input', $event)"
    :min="minStep"
    :max="maxStep"
    always-dirty
    color="grey darken-2"
    thumb-size="48"
  >
    <template v-slot:prepend>
      <v-icon small color="grey darken-2" @click="decrementStep" class="mr-1">
        fas fa-minus
      </v-icon>
    </template>
    <template v-slot:append>
      <v-icon small color="grey darken-2" @click="incrementStep" class="ml-1">
        fas fa-plus
      </v-icon>
    </template>
  </v-slider>
</template>

<script>
export default {
  name: "timestampSlider",
  props: {
    value: {
      type: Number,
      required: true
    },
    minStep: {
      type: Number,
      required: true
    },
    maxStep: {
      type: Number,
      required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    incrementStep: function() {
      const val = this.value === this.maxStep ? this.minStep : this.value + 1;
      this.$emit("input", val);
    },
    decrementStep: function() {
      const val = this.value === this.minStep ? this.maxStep : this.value - 1;
      this.$emit("input", val);
    }
  },
  mounted: function() {
    setInterval(() => {
      if (!this.isRunning) return;
      this.incrementStep();
    }, 33);
  }
};
</script>

<style></style>
