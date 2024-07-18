import React, { useState } from 'react';
import './PDFTemplate.css';
import { getModel } from '../../Data';
import { PdfProps } from '../../Type';
import IframePdf from '../../components/pdf/IframePdf';

const PDFTemplate: React.FC = () => {
  const [data, setData] = useState<PdfProps>(getModel);

  return (
    <div className="container">
      <h2>PDF Template</h2>
      <p>PDF display function from base64 data, with zoom and rotate functions.</p>
      <div id="iframe-container" style={{ width: '100%', height: '100%' }}>
        <IframePdf model={data.model} />
      </div>
    </div>
  );
};

export default PDFTemplate;
