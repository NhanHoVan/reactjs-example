import React, { useEffect, useRef, useState } from 'react';
import './Pdf.css';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfProps } from '../../Type';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

const Pdf: React.FC<PdfProps> = ({ model }) => {
  const [scale, setScale] = useState<number>(model.rateZoom || 1.0);
  const [rotation, setRotation] = useState<number>(model.rotation || 0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [dataPdf, setDataPdf] = useState<ArrayBuffer | null>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  useEffect(() => {
    if (model.base64Data) {
      const data = base64ToArrayBuffer(model.base64Data);
      setDataPdf(data);
    }
  }, [model.base64Data]);

  useEffect(() => {
    if (dataPdf) {
      pdfjsLib.getDocument({
        data: dataPdf,
        cMapUrl: "https://unpkg.com/pdfjs-dist@2.16.105/cmaps/",
        cMapPacked: true
      }).promise.then(async function (pdf) {
        try {
          const canvasList: HTMLCanvasElement[] = [];
          let totalHeight = 0;
          const pageWidth = (await pdf.getPage(1)).getViewport({ scale, rotation }).width;

          for (let pageN = 1; pageN <= pdf.numPages; pageN++) {
            const page = await pdf.getPage(pageN);
            const viewport = page.getViewport({ scale, rotation });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            totalHeight += viewport.height + 10;

            await page.render({ canvasContext: context as CanvasRenderingContext2D, viewport }).promise;
            canvasList.push(canvas);
          }

          const finalCanvas = document.createElement('canvas');
          const finalContext = finalCanvas.getContext('2d');
          finalCanvas.height = totalHeight;
          finalCanvas.width = pageWidth;

          let yOffset = 0;
          canvasList.forEach(canvas => {
            finalContext?.drawImage(canvas, 0, yOffset);
            yOffset += canvas.height + 10;
          });

          const ballElement = ballRef.current;
          if (ballElement) {
            ballElement.innerHTML = ''; // Clear existing content
            ballElement.appendChild(finalCanvas);
          } else {
            console.error('Element with id "ball" not found.');
          }

        } catch (error) {
          console.error('Error processing PDF:', error);
        }
      }).catch(error => {
        console.error('Error loading PDF:', error);
      });
    }
  }, [dataPdf, scale, rotation]);

  useEffect(() => {
    const ball = ballRef.current;
    const pdf = pdfRef.current as HTMLDivElement;
    if (ball) {
      ball.onmousedown = (event) => {
        const shiftX = event.clientX - ball.getBoundingClientRect().left;
        const shiftY = event.clientY - ball.getBoundingClientRect().top;

        ball.style.position = 'absolute';
        ball.style.zIndex = '1000';
        pdf.append(ball);

        const moveAt = (pageX: number, pageY: number) => {
          ball.style.left = `${pageX - shiftX}px`;
          ball.style.top = `${pageY - shiftY}px`;
        };

        const onMouseMove = (event: MouseEvent) => {
          moveAt(event.pageX, event.pageY);
          ball.hidden = true;
          const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
          ball.hidden = false;
          if (!elemBelow) return;
          const droppableBelow = elemBelow.closest('.droppable');
        };

        const onMouseOut = (event: MouseEvent) => {
          if (!event.relatedTarget || !ball.contains(event.relatedTarget as Node)) {
            document.removeEventListener('mousemove', onMouseMove);
            ball.onmouseup = null;
            document.removeEventListener('mouseout', onMouseOut);
          }
        };

        document.addEventListener('mouseout', onMouseOut);
        document.addEventListener('mousemove', onMouseMove);

        ball.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseout', onMouseOut);
          ball.onmouseup = null;
        };
      };

      ball.ondragstart = () => false;
    }
  }, []);

  useEffect(() => {
    setScale(model.rateZoom || 1.0);
  }, [model.rateZoom]);

  useEffect(() => {
    setRotation(model.rotation || 0);
  }, [model.rotation]);

  const zoomIn = () => {
    const newScale = scale + 0.1;
    setScale(newScale < 2 ? newScale : 2);
    setZoomPercent(Math.round(newScale * 100));
  };

  const zoomOut = () => {
    const newScale = scale - 0.1;
    setScale(newScale >= 0.1 ? newScale : 0.1);
    setZoomPercent(Math.round(newScale * 100));
  };

  const handleRotateRight = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <div id="pdf" ref={pdfRef} className="pdf_react">
      <div className="zoom-controls">
        <button onClick={zoomIn}>
          <i className="fa fa-plus"></i>
        </button>
        <span>{zoomPercent}%</span>
        <button onClick={zoomOut}>
          <i className="fa fa-minus"></i>
        </button>
        <button onClick={handleRotateRight}>
          <i className="fas fa-redo-alt"></i>
        </button>
      </div>
      <div id="ball" ref={ballRef}></div>
    </div>
  );
};

export default Pdf;
