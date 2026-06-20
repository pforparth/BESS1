import fs from "fs";
const server = fs.readFileSync("dist/server.cjs", "utf8");
console.log(server.indexOf("pdfParse is:"));
