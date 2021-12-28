/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { contextBridge, ipcRenderer } from "electron";
const ipc = require("electron").ipcRenderer;
import path from "path";
import os from "os";

contextBridge.exposeInMainWorld("myAPI", {
  doAThing: () => {
    return "oi";
  },
  save: function (sql) {
    return new Promise((resolve, reject) => {
      ipc.send("invokeAction", { sql });
      ipc.once("actionReply", (event, response) => {
        resolve(response);
      });
    });
  },
  testConnection: function (params) {
    return new Promise((resolve, reject) => {
      ipc.send("testConnection", params);
      ipc.once("testConnection", (event, response) => {
        resolve(response);
      });
    });
  },
});
