import { app, BrowserWindow, nativeTheme, dialog } from "electron";
import path from "path";
import os from "os";
import fs from "fs";
const ipc = require("electron").ipcMain;

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

ipc.on("invokeAction", async (event, data) => {
  var mysql = require("mysql");

  const con = mysql.createConnection({
    host: data.sql.address,
    user: data.sql.user,
    password: data.sql.password,
  });

  con.connect(function (err) {
    if (err) {
      event.sender.send("actionReply", {
        status: "error",
        err,
      });
    }
    con.query(data.sql.sql, function (err, result) {
      if (err) {
        event.sender.send("actionReply", {
          status: "error",
          err,
        });
      }
      event.sender.send("actionReply", result);
    });
  });
});

ipc.on("testConnection", (event, data) => {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: data.address,
    user: data.user,
    password: data.password,
  });

  con.connect(function (err, result) {
    if (err) {
      event.sender.send("testConnection", {
        status: "error",
        err,
      });
    }
    event.sender.send("testConnection", {
      status: "connected",
      result,
    });
  });
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
