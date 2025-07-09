
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(<App />);
} else {
  console.error("Root container not found");
}

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})

