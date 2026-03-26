import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DATE_REGEX = /^(?:[0-3]?\d[\/\-][0-1]?\d[\/\-](?:\d{4}|\d{2})|[0-3]?\d\s[A-Za-z]{3}\s(?:\d{4}|\d{2}))/;

export const parsePdfBankStatement = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const extractedRows = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    // Sort items by vertical position first
    const items = content.items.sort((a, b) => b.transform[5] - a.transform[5]);
    
    // Group into lines
    const lines = [];
    let currentLine = [];
    let currentY = null;
    
    for (const item of items) {
      if (currentY === null || Math.abs(item.transform[5] - currentY) > 5) {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [item];
        currentY = item.transform[5];
      } else {
        currentLine.push(item);
      }
    }
    if (currentLine.length > 0) lines.push(currentLine);
    
    // Parse each line
    for (const line of lines) {
      line.sort((a, b) => a.transform[4] - b.transform[4]);
      const text = line.map(l => l.str.trim()).filter(Boolean).join(' ');
      
      const match = text.match(DATE_REGEX);
      if (match) {
        const dateStr = match[0];
        const rest = text.substring(dateStr.length).trim();
        
        const words = rest.split(/\s+/);
        const amounts = [];
        const description = [];
        
        words.forEach(w => {
           const cln = w.replace(/,/g, '');
           if (cln.match(/^-?\d+\.\d{2}$/)) amounts.push(cln);
           else description.push(w);
        });
        
        if (amounts.length >= 1) {
           extractedRows.push({
             'Date': dateStr,
             'Description': description.join(' '),
             'Amount': amounts[0]
           });
        }
      }
    }
  }
  return extractedRows;
};
