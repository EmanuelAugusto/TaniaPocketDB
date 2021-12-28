<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col-md-12 col-12">
        <q-input
          v-model="sql"
          dense
          outlined
          type="textarea"
          input-style="color:white; font-weight: bold;"
          @keydown.prevent.ctrl.enter="runSql"
        />
      </div>
      <div class="col-md-12 col-12 q-mt-sm">
        <q-btn label="Run" @click="runSql" color="deep-purple"></q-btn>
      </div>
      <div class="col-md-12 col-12 q-gutter-y-md q-mt-sm">
        <q-tabs
          v-model="tab"
          inline-label
          class="bg-deep-purple text-white shadow-2 rounded-borders"
          align="left"
          dense
        >
          <q-tab name="definitionTable" icon="info" label="Info. Tabela" />
          <q-tab name="dataTable" icon="table_rows" label="Dados" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="definitionTable">
            <pre class="rounded-borders"> {{ tableColumnsTypes }}</pre>
          </q-tab-panel>
          <q-tab-panel name="dataTable">
            <div v-if="!loading" class="q-pa-md row items-start q-gutter-md">
              <q-card
                v-for="(row, key) in rowsEdited"
                :key="key"
                class="col-md-12"
                flat
                bordered
              >
                <q-card-section horizontal>
                  <div class="col">
                    <div
                      v-for="(columnName, keyTable) in Object.keys(row)"
                      :key="keyTable"
                      class="cursor-pointer q-pa-sm"
                    >
                      {{ `${columnName}: ${row[columnName]}` }}
                      <q-popup-proxy>
                        <q-banner>
                          {{ `${columnName}: ${row[columnName]}` }}
                          <q-input
                            v-model="rowsEdited[key][`${columnName}`]"
                            dense
                            outlined
                            autofocus
                            counter
                          />
                          <!-- <div class="q-pa-md q-gutter-sm">
                            <q-btn
                              v-close-popup
                              label="Cancelar"
                              color="red"
                              outline
                            ></q-btn>
                            <q-btn
                              label="Salvar"
                              color="deep-purple"
                              @click="updateRow(key)"
                            ></q-btn>
                          </div> -->
                        </q-banner>
                      </q-popup-proxy>
                    </div>
                  </div>
                  <q-card-actions vertical class="justify-around q-px-md">
                    <q-btn
                      flat
                      round
                      color="deep-purple"
                      icon="sd_storage"
                      @click="updateRow(key)"
                    >
                      <q-tooltip> Salvar </q-tooltip>
                    </q-btn>
                    <q-btn flat round color="red" icon="delete">
                      <q-tooltip> Deletar </q-tooltip>
                    </q-btn>
                  </q-card-actions>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Notify } from "quasar";

export default {
  name: "Index",
  data() {
    return {
      rowsEdited: [],
      loading: true,
    };
  },
  watch: {
    sqlResult: {
      deep: true,
      handler() {
        this.setValueResult();
      },
    },
  },
  computed: {
    ...mapState("databaseModule", [
      "sqlResult",
      "sqlText",
      "tabSelected",
      "tableColumnsTypes",
      "databaseSelected",
      "tableSelected",
    ]),
    sql: {
      get() {
        return this.sqlText;
      },
      set(val) {
        this.ActionSetSqlText(val);
      },
    },
    tab: {
      get() {
        return this.tabSelected;
      },
      set(val) {
        this.ActionSetSqlTab(val);
      },
    },
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionGetDatabases",
      "ActionSetSqlText",
      "ActionSetSqlTab",
    ]),
    setValueResult() {
      this.loading = true;
      this.rowsEdited = [];
      for (const iterator of this.sqlResult) {
        let string = JSON.stringify(iterator);
        let newObj = JSON.parse(string);
        this.rowsEdited.push(newObj);
      }
      this.loading = false;
    },
    async updateRow(scope) {
      let primaryKeys = this.tableColumnsTypes
        .filter((tC) => tC.Key === "PRI")
        .map((t) => t.Field);

      let rowEdited = this.rowsEdited[scope];
      let originalRow = this.sqlResult[scope];

      let attrsChanged = [];

      for (const key in rowEdited) {
        if (originalRow[key] !== rowEdited[key]) {
          attrsChanged.push({ [key]: rowEdited[key] });
        }
      }

      if (attrsChanged.length > 0) {
        let sets = "";
        let primaryKeysSql = "";

        for (const column of attrsChanged) {
          let columnName = Object.keys(column)[0];
          sets += `${columnName}= '${column[columnName]}'`;
        }

        for (const [i, column] of primaryKeys.entries()) {
          primaryKeysSql += `${column}= '${rowEdited[column]}' ${
            primaryKeys[i + 1] ? "AND" : ""
          }`;
        }

        let baseSql = `UPDATE ${this.tableSelected} SET ${sets} WHERE ${primaryKeysSql}`;
        await this.ActionGetDatabases({
          sql: baseSql,
          mutation: null,
        });
      } else {
        Notify.create({
          message: "Nada mudou por aqui",
          position: "center",
          color: "warning",
        });
      }
    },
    async runSql() {
      const textSelected = window.getSelection().toString();

      await this.ActionGetDatabases({
        sql: textSelected ? textSelected : this.sql,
        mutation: "setSqlResult",
      });
    },
  },
};
</script>
<style scoped>
/* pre {
  font-family: Consolas, "courier new";
  color: crimson;
  background-color: #f1f1f1;
  white-space: break-word;
  word-break: break-all;
  padding: 2px;
  font-size: 105%;
  overflow: auto;
  height: 300px;
} */
</style>
