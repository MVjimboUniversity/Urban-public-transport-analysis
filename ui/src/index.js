import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './assets/styles/global.css'
import Router from './components/ui/Router';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router></Router>
    </React.StrictMode>
);

reportWebVitals();
