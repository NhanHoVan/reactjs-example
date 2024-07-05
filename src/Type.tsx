export interface PdfProps {
    model: {
      base64Data: string;
      rateZoom?: number;
      rotation?: number;
    };
  }