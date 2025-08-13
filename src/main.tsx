
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './state/store.ts';


const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(
  <Provider store={store}>
    <App />
  </Provider>
  );
} else {
  console.error("Root container not found");
}


// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})

