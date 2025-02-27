"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  sendHighlightScript: (script) => electron.ipcRenderer.send("highlight-script", script),
  onExecuteHighlightScript: (callback) => electron.ipcRenderer.on("execute-highlight-script", (_event, script) => callback(script)),
  removeHighlightScriptListener: () => electron.ipcRenderer.removeAllListeners("execute-highlight-script")
});
electron.contextBridge.exposeInMainWorld("accessibilityAPI", {
  setAccessibilitySupport: (enabled) => electron.ipcRenderer.send("set-accessibility-support", enabled),
  getAccessibilitySupport: () => electron.ipcRenderer.invoke("get-accessibility-support")
});
