export default function () {
  return {
    databasesDb: [],
    sqlResult: [],
    sqlText: `CREATE TABLE tisaude_app.Persons (
      PersonID int,
      LastName varchar(255),
      FirstName varchar(255),
      Address varchar(255),
      City varchar(255)
  );`,
    modalConfigureConnection: {
      modal: false,
      data: null,
    },
    databasesTables: [],
    modalIsComponent: {
      modal: false,
      data: null,
    },
    ddlFromTable: null,
    tabSelected: "definitionTable",
    tableColumnsTypes: [],
    databaseSelected: "",
    tableSelected: "",
  };
}
