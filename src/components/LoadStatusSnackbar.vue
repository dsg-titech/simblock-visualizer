<template>
  <v-snackbar
    :value="value"
    @input="$emit('input', $event)"
    bottom
    right
    :timeout="3000"
    :color="loadSuccess ? 'success' : 'error'"
  >
    <span subheading> Load {{ loadSuccess ? "Success" : "Failure" }} </span>
    <v-btn icon small @click="$emit('input', false)">
      <v-icon>fas fa-times</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "loadStatusSnackbar",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    loadSuccess: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style></style>
