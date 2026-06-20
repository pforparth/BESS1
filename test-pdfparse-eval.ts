import pdfParseModule from "pdf-parse";
async function run() {
  const fileBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
  
  console.log("pdfParseModule:", typeof pdfParseModule, pdfParseModule);
  let pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : (pdfParseModule as any).default || pdfParseModule;
  console.log("First check (pdfParse):", typeof pdfParse, pdfParse);
  
  let fn = pdfParse;
  if (typeof fn !== "function") fn = (pdfParse as any).default;
  console.log("Second check (fn):", typeof fn, fn);
  
  if (typeof fn !== "function") {
    const mod = await import("pdf-parse");
    fn = mod.default || mod;
    console.log("Third check (fn from import):", typeof fn, fn);
  }
}
run();
