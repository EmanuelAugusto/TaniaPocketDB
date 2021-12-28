<template>
  <q-dialog
    v-if="modalIsComponent.modal"
    :model-value="modalIsComponent.modal"
    persistent
    @before-show="show"
    @before-hide="hide"
  >
  <component :is="modalIsComponent.data.component"></component>

  </q-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ModalIsComponent",
  data() {
    return {
      form: {
        user: "",
        passsword: "",
        address: "",
      },
    };
  },
  computed: {
    ...mapState("databaseModule", ["modalIsComponent"]),
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionSetStatemodalIsComponent",
    ]),
    hide() {
      this.ActionSetStatemodalIsComponent({ modal: false, data: null });
    },
  },
};
</script>

<style></style>
