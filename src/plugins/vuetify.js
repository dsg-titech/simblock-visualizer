import Vue from "vue";
import Vuetify from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
});
