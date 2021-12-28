export function getDataFromConnection() {
  let obj = JSON.parse(localStorage.getItem("configConnection"));
  return obj ? obj : null;
}
