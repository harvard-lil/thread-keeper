//------------------------------------------------------------------------------
// "check-pdf" dialog logic
//------------------------------------------------------------------------------
const checkPdfDialog = document.querySelector("dialog#check-pdf");

// Open / close based on hash
window.addEventListener('hashchange', (event) => {

  const newURL = new URL(event.newURL);
  const oldURL = new URL(event.oldURL);

  if (newURL.hash === "#check-pdf") {
    checkPdfDialog.showModal();
  }

  if (oldURL.hash === "#check-pdf" && oldURL !== newURL) {
    checkPdfDialog.close();
  }
});

// Open on load if hash already present
if (window.location.hash === "#check-pdf") {
  checkPdfDialog.showModal();
}

// Clear output on file change
checkPdfDialog.querySelector("input").addEventListener("change", () => {
  checkPdfDialog.querySelector("textarea").value = `Click on "Check" to proceed.\n`;
});

// Check file on click on "Check"
checkPdfDialog.querySelector("button").addEventListener("click", async(e) => {
  let hash = "";
  const output = checkPdfDialog.querySelector("textarea");
  output.value = "";

  try {
    const data = await checkPdfDialog.querySelector("input[type='file']").files[0].arrayBuffer();

    // Generate hash and convert it to hex and then base 64.
    // Was of tremendous help: https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
    hash = await (async() => {
      const hash = await crypto.subtle.digest('SHA-512', data);
      const walkable = Array.from(new Uint8Array(hash));
      const toHex = walkable.map((b) => b.toString(16).padStart(2, "0")).join("");
      return btoa(
        toHex
          .match(/\w{2}/g)
          .map(function (a) {
            return String.fromCharCode(parseInt(a, 16));
          })
          .join("")
      );
    })();
    
  }
  catch(err) {
    output.value = `Could not calculate hash of the file selected, if any.\n`;
  }

  try {
    const response = await fetch(`/api/v1/hashes/check/${encodeURIComponent(hash)}`);
    output.value += `SHA-512 hash\n---${hash}\n---\n`;

    switch (response.status) {
      case 200:
        output.value += `This hash is CONFIRMED to be present in the logs.\n`;
      break;

      case 404:
        output.value += `This hash was NOT FOUND in the logs.\n`;
      break;

      default:
        throw new Error(response.status);
      break;
    }
  }
  catch(err) {
    console.log(`/api/v1/hashes/check/<hash> responded with HTTP ${err}`);
    output.value += `An error occurred while trying to verify file.`;
  }
});
