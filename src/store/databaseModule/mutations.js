export function setDatabasesDb(state, payload) {
  state.databasesDb = payload;
}

export function setSqlResult(state, payload) {
  state.sqlResult = payload;
}

export function setSqlText(state, payload) {
  state.sqlText = payload;
}

export function setModalConfigureConnection(state, payload) {
  state.modalConfigureConnection = payload;
}
export function setModalIsComponent(state, payload) {
  state.modalIsComponent = payload;
}

export function setTablesFromDatabase(state, payload) {
  state.databasesTables = payload;
}

export function setDdlFromTable(state, payload) {
  state.ddlFromTable = payload;
}

export function setTabSql(state, payload) {
  state.tabSelected = payload;
}

export function setTableColumnsTypes(state, payload) {
  state.tableColumnsTypes = payload;
}

export function setDatabaseSelected(state, payload) {
  state.databaseSelected = payload;
}

export function setTableSelected(state, payload) {
  state.tableSelected = payload;
}
