// main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Definir api_url solo si no existe ya en localStorage
if (!localStorage.getItem('api_url')) {
  localStorage.setItem('api_url', 'http://localhost:8081');
}

createRoot(document.getElementById("root")!).render(<App />);

