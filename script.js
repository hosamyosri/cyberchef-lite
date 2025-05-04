// Base64 Encode/Decode
function runBase64(mode) {
  const input = document.getElementById("base64Input").value;
  const output = document.getElementById("base64Output");
  try {
    if (mode === "encode") {
      output.textContent = btoa(input);
    } else {
      output.textContent = atob(input);
    }
  } catch (e) {
    output.textContent = "⚠️ Invalid input: " + e.message;
  }
}

// Hash Generator
function generateHashes() {
  const input = document.getElementById("hashInput").value;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const output = document.getElementById("hashOutput");

  window.crypto.subtle.digest("SHA-256", data).then(buffer => {
    const hashArray = Array.from(new Uint8Array(buffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    const md5 = CryptoJS.MD5(input).toString();

    output.textContent = `MD5   : ${md5}\nSHA256: ${sha256}`;
  });
}

// Regex Extractor
function extractData() {
  const text = document.getElementById("regexInput").value;
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const ips = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];

  const result = `Emails:\n${emails.join("\n") || "None"}\n\nIPs:\n${ips.join("\n") || "None"}\n\nURLs:\n${urls.join("\n") || "None"}`;
  document.getElementById("regexOutput").textContent = result;
}

// JWT Decoder
function decodeJWT() {
  const token = document.getElementById("jwtInput").value;
  const output = document.getElementById("jwtOutput");
  try {
    const parts = token.split(".");
    if (parts.length < 2) throw new Error("Invalid JWT format");
    const decode = (str) => decodeURIComponent(atob(str.replace(/-/g, "+").replace(/_/g, "/")).split("").map(c => {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));

    const header = JSON.stringify(JSON.parse(decode(parts[0])), null, 2);
    const payload = JSON.stringify(JSON.parse(decode(parts[1])), null, 2);
    output.textContent = `Header:\n${header}\n\nPayload:\n${payload}`;
  } catch (e) {
    output.textContent = "⚠️ Error decoding JWT: " + e.message;
  }
}

// Text Cleaner
function cleanText() {
  const input = document.getElementById("cleanInput").value;
  const cleaned = [...input].filter(c => c >= ' ' && c <= '~').join("");
  document.getElementById("cleanOutput").textContent = cleaned;
}
