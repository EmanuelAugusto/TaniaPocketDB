<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-mt-md">
    <q-toolbar>
      <q-avatar>
        <q-icon color="red" name="delete" />
      </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold">Deletar Tabela</span></q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="q-pt-none q-mt-md q-gutter-sm">
      Deseja Realmente deletar
      <strong>{{ modalIsComponent.data.tableName }}</strong>
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn outline label="Fechar" color="red" v-close-popup />
      <q-btn color="red" label="Deletar" @click="deleteTable" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "DropTable",
  computed: {
    ...mapState("databaseModule", ["modalIsComponent"]),
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionSetStatemodalIsComponent",
      "ActionTestConnection",
      "ActionSetSqlText",
      "ActionGetDatabases",
    ]),
    async deleteTable() {
      let sql = `DROP TABLE ${this.modalIsComponent.data.database}.${this.modalIsComponent.data.tableName}`;
      await this.ActionGetDatabases({
        sql,
        mutation: null,
      });

      await this.ActionGetDatabases({
        sql: `SHOW TABLES FROM ${this.modalIsComponent.data.database}`,
        mutation: "setTablesFromDatabase",
      });
      this.ActionSetStatemodalIsComponent({
        modal: false,
        data: null,
      });
    },
  },
};
</script>

<style></style>
