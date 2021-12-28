<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-deep-purple">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <strong>TaniaDBPocket</strong>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list bordered separator class="q-ma-sm rounded-borders">
        <q-item-label header> DATABASES </q-item-label>
        <q-item clickable v-ripple @click="getDatabases">
          <q-item-section avatar>
            <q-icon color="deep-purple" name="update" />
          </q-item-section>

          <q-item-section>RECARREGAR</q-item-section>
        </q-item>
        <q-expansion-item
          v-for="(db, key) in computedArrayListDatabases"
          :key="key"
          switch-toggle-side
          expand-separator
          icon="storage"
          group="databases"
          class="rounded-borders"
          :label="db.Database"
          @before-show="getTablesFromDatabase(db)"
        >
          <q-card class="q-ma-none">
            <q-card-section class="q-ma-none">
              <q-list
                v-for="(dbT, key) in databasesTables"
                :key="key"
                bordered
                separator
                class="rounded-borders"
              >
                <q-item
                  dense
                  @dblclick="
                    selectTable({
                      tableName: dbT[Object.keys(dbT)[0]],
                      database: db.Database,
                    })
                  "
                >
                  <q-item-section>{{
                    dbT[Object.keys(dbT)[0]]
                  }}</q-item-section>
                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        class="gt-xs"
                        size="12px"
                        flat
                        dense
                        round
                        icon="table_rows"
                        @click="
                          selectTable({
                            tableName: dbT[Object.keys(dbT)[0]],
                            database: db.Database,
                          })
                        "
                      >
                        <q-tooltip> Mostrar tabela </q-tooltip>
                      </q-btn>
                      <q-btn size="12px" flat dense round icon="more_vert">
                        <q-menu>
                          <q-list style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                ActionSetStatemodalIsComponent({
                                  modal: true,
                                  data: {
                                    tableName: dbT[Object.keys(dbT)[0]],
                                    database: db.Database,
                                    component: CopyDdl,
                                  },
                                })
                              "
                            >
                              <q-item-section>DDL</q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                ActionSetStatemodalIsComponent({
                                  modal: true,
                                  data: {
                                    tableName: dbT[Object.keys(dbT)[0]],
                                    database: db.Database,
                                    component: DropTable,
                                  },
                                })
                              "
                            >
                              <q-item-section>Deletar tabela</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>

                        <q-tooltip> Mais </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <q-separator />
      <q-list>
        <q-item-label header> Config </q-item-label>
        <q-item
          clickable
          v-ripple
          @click="
            ActionSetStateModalConfigureConnection({
              modal: true,
              data: null,
            })
          "
        >
          <q-item-section avatar>
            <q-icon color="deep-purple" name="cable" />
          </q-item-section>

          <q-item-section>Conexão</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="
            ActionSetStatemodalIsComponent({
              modal: true,
              data: {
                component: AboutThisProject,
              },
            })
          "
        >
          <q-item-section avatar>
            <q-icon color="deep-purple" name="info" />
          </q-item-section>

          <q-item-section>Sobre</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="background-color: #2c2e43">
      <router-view />
    </q-page-container>
    <ModalConfigureConnection />
    <ModalIsComponent />
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ModalConfigureConnection from "../components/ModalConfigureConnection.vue";
import ModalIsComponent from "../components/ModalIsComponent.vue";
import CopyDdl from "../components/CopyDdl.vue";
import DropTable from "../components/DropTable.vue";
import AboutThisProject from "../components/AboutThisProject.vue";

export default {
  name: "Menu",
  components: {
    ModalConfigureConnection,
    ModalIsComponent,
  },
  data() {
    return {
      CopyDdl,
      DropTable,
      AboutThisProject,
      leftDrawerOpen: false,
      notif1: false,
    };
  },
  computed: {
    ...mapState("databaseModule", ["databasesDb", "databasesTables"]),
    computedArrayListDatabases() {
      let dbs = [];
      dbs = this.databasesDb.filter(
        (d) =>
          ![
            "performance_schema",
            "mysql",
            "phpmyadmin",
            "information_schema",
          ].includes(d.Database)
      );
      return dbs;
    },
  },
  mounted() {
    this.getDatabases();
  },
  methods: {
    ...mapActions("databaseModule", [
      "ActionGetDatabases",
      "ActionSetSqlText",
      "ActionSetStateModalConfigureConnection",
      "ActionSetStatemodalIsComponent",
      "ActionSetSqlTab",
      "ActionSetDatabaseSelected",
      "ActionSetTableSelected",
    ]),
    selectDb({ Database }) {
      let sql = `SHOW TABLES FROM ${Database}`;
      this.ActionSetSqlText(sql);
      this.ActionGetDatabases({
        sql,
        mutation: "setSqlResult",
      });
    },
    getDatabases() {
      this.ActionGetDatabases({
        sql: "SHOW DATABASES",
        mutation: "setDatabasesDb",
      });
    },
    getTablesFromDatabase({ Database }) {
      this.ActionSetDatabaseSelected(Database);
      let sql = `SHOW TABLES FROM ${Database}`;
      this.ActionSetSqlText(sql);
      this.ActionGetDatabases({
        sql,
        mutation: "setTablesFromDatabase",
      });
    },
    async selectTable({ tableName, database }) {
      this.ActionSetTableSelected(`${database}.${tableName}`);
      this.ActionSetSqlText(`SELECT * FROM ${database}.${tableName} LIMIT 10`);
      await this.ActionGetDatabases({
        sql: `SELECT * FROM ${database}.${tableName} LIMIT 10`,
        mutation: "setSqlResult",
      });
      await this.ActionGetDatabases({
        sql: `SHOW COLUMNS FROM ${database}.${tableName}`,
        mutation: "setTableColumnsTypes",
      });
      this.ActionSetSqlTab("dataTable");
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>
