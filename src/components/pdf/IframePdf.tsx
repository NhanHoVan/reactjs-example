import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Pdf from './Pdf';
import { PdfProps } from '../../Type';

const IframePdf: React.FC<PdfProps> = ({ model }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        const root = iframeDoc.createElement('div');
        root.id = 'root';
        iframeDoc.body.appendChild(root);

        const fontAwesomeLink = iframeDoc.createElement('link');
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        fontAwesomeLink.rel = 'stylesheet';
        iframeDoc.head.appendChild(fontAwesomeLink);

        const style = iframeDoc.createElement('style');
        style.textContent = `
          * {
            font-family: 'Inter', sans-serif;
          }

          body {
            margin: 0;
            background-color: grey;
          }

          .pdf_react {
            height: 100%;
            display: flex;
            justify-content: center;
            background-color: #808080;
          }

          #ball:hover {
            cursor: move;
          }

          #root {
            text-align: center;
            text-align: -webkit-center;
            align-content: center;
          }

          #root #ball {
            background-color: grey;
            width: fit-content;
            margin-top: 5px;
          }

          .zoom-controls {
            position: fixed;
            top: 10px;
            left: 10px;
            display: flex;
            align-items: center;
            z-index: 1000;
            gap: 10px;
          }

          .zoom-controls button {
            background-color: #f0f0f0;
            border: none;
            padding: 5px;
            cursor: pointer;
          }

          .zoom-controls button:hover {
            background-color: #ccc;
          }

          .zoom-controls span {
            margin-left: 5px;
            font-size: 14px;
          }
        `;
        iframeDoc.head.appendChild(style);

        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(<Pdf model={model} />);
      }
    }
  }, [model]);

  return (
    <iframe ref={iframeRef} width="100%" height="700" style={{ border: 'none' }} title='Pdf Viewer'></iframe>
  );
};

export default IframePdf;
