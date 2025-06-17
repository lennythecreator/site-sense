import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs"),
      webviewTag: true,
      nodeIntegration: false,
      devTools: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"))
    win.webContents.openDevTools()
  }

  win.webContents.openDevTools()

  // Handle IPC events
  ipcMain.on("highlight-script", (event, script) => {
    event.reply("execute-highlight-script", script)
  })

  ipcMain.handle("get-accessibility-support", () => {
    return app.accessibilitySupportEnabled
    
  })

  ipcMain.on("set-accessibility-support", (_event, enabled) => {
    console.log("Setting accessibility support to:", enabled);
    console.log("Main process: accessibilitySupportEnabled =", app.accessibilitySupportEnabled);
    app.setAccessibilitySupportEnabled(true)
    
  })
}

ipcMain.on('open-violation-window', (event, routePath: string) => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // adjust as needed
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${routePath}`);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: routePath,
    });
  }
});

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

// Log when the main process has finished initializing
console.log("Main process initialized")

