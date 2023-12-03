import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './assets/styles/global.css'
import Router from './components/ui/Router';


export const BASE_URL = 'http://localhost:80';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router></Router>
);

reportWebVitals();
