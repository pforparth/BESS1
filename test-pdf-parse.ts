import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

async function run() {
  try {
    const b = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
    const data = await pdfParse(b);
    console.log("Success");
  } catch(e) {
    console.error(e);
  }
}
run();
