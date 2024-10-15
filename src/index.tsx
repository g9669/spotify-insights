import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Callback from './Callback';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
