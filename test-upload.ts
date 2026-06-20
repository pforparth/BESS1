async function run() {
  try {
    const formData = new FormData();
    const pdfBlob = new Blob(["%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"], { type: "application/pdf" });
    formData.append("pdf", pdfBlob as any, "test.pdf");

    const res = await fetch("http://localhost:3000/api/upload-pdf", {
      method: "POST",
      body: formData,
    });
    console.log("Status:", res.status);
    console.log("Response text:", await res.text());
  } catch(e) {
    console.error(e);
  }
}
run();
