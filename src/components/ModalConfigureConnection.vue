<template>
  <q-dialog
    :model-value="modalConfigureConnection.modal"
    persistent
    @before-show="show"
    @before-hide="hide"
  >
    <q-card>
      <q-toolbar>
        <q-avatar>
          <q-icon color="primary" name="cable" />
        </q-avatar>

        <q-toolbar-title
          ><span class="text-weight-bold"
            >Configure sua conexão</span
          ></q-toolbar-title
        >

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="q-pt-none q-gutter-sm">
        <q-input dense outlined v-model="form.user" label="Usuário" autofocus />
        <q-input
          dense
          outlined
          v-model="form.passsword"
          label="Senha"
          autofocus
        />
        <q-input
          dense
          outlined
          v-model="form.address"
          label="Endereço"
          autofocus
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn outline label="Cancelar" color="red" v-close-popup />
        <q-btn color="deep-purple" label="Conectar" @click="connect" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getDataFromConnection } from "../storage/storage.js";

export default {
  name: "ModalConfigureConnection",
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
    ...mapState("databaseModule", ["modalConfigureConnection"]),
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionSetStateModalConfigureConnection",
      "ActionTestConnection",
    ]),
    async connect() {
      await this.ActionTestConnection(this.form);
    },
    show() {
      let data = getDataFromConnection();
      if(data){
          this.form = data
      }
    },
    hide() {
      this.ActionSetStateModalConfigureConnection({ modal: false, data: null });
    },
  },
};
</script>

<style></style>
