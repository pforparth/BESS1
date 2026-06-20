import pdfParseModule from "pdf-parse";
const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : (pdfParseModule as any).default || pdfParseModule;

async function run() {
  try {
    const data = await pdfParse(Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"));
    console.log(data);
  } catch(e: any) {
    console.log("Error inside pdfParse:", e.message);
  }
}
run();
