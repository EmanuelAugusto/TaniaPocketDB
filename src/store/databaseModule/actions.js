import { Loading, QSpinnerGears } from "quasar";
import { Notify } from "quasar";
import { getDataFromConnection } from "../../storage/storage";

export async function ActionGetDatabases({ commit }, payload) {
  return new Promise(async (resolve, reject) => {
    Loading.show({
      spinner: QSpinnerGears,
    });

    let { sql, mutation } = payload;

    let dataFromConnection = getDataFromConnection();
    let data = [];
    if (dataFromConnection) {
      data = await window.myAPI.save({
        sql,
        user: dataFromConnection.user,
        address: dataFromConnection.address,
        password: dataFromConnection.password,
      });
      if (data.status === "error") {
        let msg = "";
        if (data.err) {
          msg = `${data.err.message}`;
        } else {
          msg = "Erro desconhecido";
        }
        Notify.create({
          message: msg,
          position: "center",
          color: "negative",
        });
      } else {
        if (mutation) {
          commit(mutation, data);
        }
      }
    } else {
      Notify.create({
        message: "Configure sua conexão",
        position: "center",
        color: "negative",
      });
    }

    Loading.hide();
    resolve(data);
  });
}

export async function ActionSetSqlText({ commit }, payload) {
  commit("setSqlText", payload);
}

export async function ActionSetStateModalConfigureConnection(
  { commit },
  payload
) {
  commit("setModalConfigureConnection", payload);
}

export async function ActionSetStatemodalIsComponent({ commit }, payload) {
  commit("setModalIsComponent", payload);
}

export async function ActionSetSqlTab({ commit }, payload) {
  commit("setTabSql", payload);
}

export async function ActionSetDatabaseSelected({ commit }, payload) {
  commit("setDatabaseSelected", payload);
}

export async function ActionSetTableSelected({ commit }, payload) {
  commit("setTableSelected", payload);
}

export async function ActionTestConnection({ dispatch }, payload) {
  Loading.show({
    spinner: QSpinnerGears,
  });
  let data = await window.myAPI.testConnection({ ...payload });

  if (data.status === "error") {
    let msg = "";
    if (data.err) {
      msg = `Erro ao se conectar com o banco de Dados. Error: ${data.err.message}`;
    } else {
      msg = "Erro desconhecido";
    }
    Notify.create({
      message: msg,
      position: "center",
      color: "negative",
    });
  } else if (data.status === "connected") {
    Notify.create({
      message: "Conectado",
      position: "center",
      color: "positive",
    });
    localStorage.setItem("configConnection", JSON.stringify({ ...payload }));
    dispatch("ActionSetStateModalConfigureConnection", {
      modal: false,
      data: null,
    });

    dispatch("ActionGetDatabases", {
      sql: "SHOW DATABASES",
      mutation: "setDatabasesDb",
    });
  }
  Loading.hide();
  return data;
}
