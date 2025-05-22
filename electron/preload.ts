import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
  sendHighlightScript: (script: string) => ipcRenderer.send("highlight-script", script),
  openViolationWindow: (path: string) => ipcRenderer.send('open-violation-window', path),
  onExecuteHighlightScript: (callback: (script: string) => void) =>
    ipcRenderer.on("execute-highlight-script", (_event, script) => callback(script)),
  removeHighlightScriptListener: () => ipcRenderer.removeAllListeners("execute-highlight-script"),
})

contextBridge.exposeInMainWorld("accessibilityAPI", {
  setAccessibilitySupport: (enabled: boolean) => ipcRenderer.send("set-accessibility-support", enabled),
  getAccessibilitySupport: () => ipcRenderer.invoke("get-accessibility-support"),
})

