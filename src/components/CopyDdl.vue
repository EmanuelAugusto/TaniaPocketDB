<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-mt-md">
    <q-toolbar>
      <q-avatar>
        <q-icon color="primary" name="cable" />
      </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold">DDL DA TABELA</span></q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section
      v-if="ddlFromTable"
      ref="copyddl"
      class="q-pt-none q-mt-md q-gutter-sm"
    >
      {{ ddlFromTable[0]["Create Table"] }}
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn outline label="Fechar" color="red" v-close-popup />
      <q-btn color="deep-purple" label="Copiar" @click="copy" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Notify } from "quasar";

export default {
  name: "CopyDdl",
  computed: {
    ...mapState("databaseModule", ["modalIsComponent", "ddlFromTable"]),
  },
  mounted() {
    let sql = `SHOW CREATE TABLE ${this.modalIsComponent.data.database}.${this.modalIsComponent.data.tableName}`;
    this.ActionSetSqlText(sql);
    this.ActionGetDatabases({
      sql,
      mutation: "setDdlFromTable",
    });
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionSetStatemodalIsComponent",
      "ActionTestConnection",
      "ActionSetSqlText",
      "ActionGetDatabases",
    ]),
    async copy() {
      try {
        await navigator.clipboard.writeText(
          this.ddlFromTable[0]["Create Table"]
        );
        Notify.create({
          message: "Copiado",
          position: "center",
          color: "positive",
        });
      } catch ($e) {
        Notify.create({
          message: "Erro ao copiar",
          position: "center",
          color: "negative",
        });
      }
    },
  },
};
</script>

<style></style>
