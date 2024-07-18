import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import ExampleTemplate2 from './templates/ExampleTemplate2';
import ExampleTemplate3 from './templates/ExampleTemplate3';
import './App.css';
import PDFTemplate from './templates/pdf/PDFTemplate';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<PDFTemplate />} />
        <Route path="/example-template-2" element={<ExampleTemplate2 />} />
        <Route path="/example-template-3" element={<ExampleTemplate3 />} />
      </Routes>
    </div>
  );
}

export default App;
