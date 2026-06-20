import pdfParseModule from "pdf-parse";
console.log("pdfParseModule:", typeof pdfParseModule, pdfParseModule);
console.log("default on module:", typeof (pdfParseModule as any).default);
const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : (pdfParseModule as any).default || pdfParseModule;
console.log("typeof pdfParse:", typeof pdfParse);
