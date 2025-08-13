export {};

declare global {
  interface Window {
    electronAPI: {
      sendHighlightScript: (script: string) => void;
      onExecuteHighlightScript: (callback: (script: string) => void) => void;
      removeHighlightScriptListener: () => void;
      openViolationWindow: (path: string) => void; // <-- Add this line
    };
  }
}