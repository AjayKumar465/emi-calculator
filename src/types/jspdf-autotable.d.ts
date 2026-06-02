declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    startY?: number;
    head?: string[][];
    body?: string[][];
    styles?: Record<string, unknown>;
    headStyles?: Record<string, unknown>;
    alternateRowStyles?: Record<string, unknown>;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): jsPDF;
}

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}
