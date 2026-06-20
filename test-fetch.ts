async function run() {
  try {
    const res = await fetch("http://localhost:3000/");
    console.log("Status:", res.status);
    console.log("Response text begins:", (await res.text()).slice(0, 100));
  } catch(e) {
    console.error(e);
  }
}
run();
