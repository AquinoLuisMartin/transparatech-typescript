const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const files = fs.readdirSync(path.join(__dirname, 'uploads'));
const pdfFiles = files.filter(f => f.endsWith('.pdf'));

if (pdfFiles.length === 0) {
  console.log('No PDF files found to test.');
  process.exit(0);
}

const filename = pdfFiles[pdfFiles.length - 1];
const filePath = path.join(__dirname, 'uploads', filename);

console.log('Testing file: ' + filePath);

(async () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    console.log('Read file successfully. Size: ' + dataBuffer.length + ' bytes');
    
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    
    console.log('PDF Parsed Successfully!');
    console.log('Text length:', data.text.length);
    console.log('Preview:', data.text.substring(0, 100));
    
  } catch (err) {
    console.error('Error:', err);
  }
})();
