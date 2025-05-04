// Unified Base64 Encode/Decode
function runBase64(mode) {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
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

// Unified Hash Generator (SHA-256)
function generateHashes() {
  const input = document.getElementById("inputBox").value;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const output = document.getElementById("outputBox");

  window.crypto.subtle.digest("SHA-256", data).then(buffer => {
    const hashArray = Array.from(new Uint8Array(buffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    const md5 = CryptoJS.MD5(input).toString();
    output.textContent = `MD5   : ${md5}\nSHA256: ${sha256}`;
  });
}

// Caesar Cipher Encrypt/Decrypt
function caesarCipher(mode) {
  const input = document.getElementById("inputBox").value;
  let shift = 3; // Default Caesar shift
  if (mode === 'decrypt') shift = 26 - shift;
  const output = document.getElementById("outputBox");
  const result = input.replace(/[a-z]/gi, c => {
    const base = c >= 'a' && c <= 'z' ? 97 : 65;
    if (!/[a-z]/i.test(c)) return c;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
  output.textContent = result;
}

// Defang URL
function defangURL() {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  const defanged = input.replace(/\./g, '[.]').replace(/http/g, 'hxxp');
  output.textContent = defanged;
}

// Fang URL
function fangURL() {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  const fanged = input.replace(/\[\.\]/g, '.').replace(/hxxp/g, 'http');
  output.textContent = fanged;
}

// URL Decode
function urlDecode() {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  try {
    output.textContent = decodeURIComponent(input);
  } catch (e) {
    output.textContent = "⚠️ Invalid URL encoding: " + e.message;
  }
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

// Fancy Game: Guess the Number
function renderGuessGame() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = `
    <div class="guess-game-container">
      <p class="guess-game-desc">I'm thinking of a number between <b>1</b> and <b>100</b>. Can you guess it?</p>
      <input id="guessInput" type="number" min="1" max="100" placeholder="Enter your guess..." />
      <button onclick="submitGuess()">Guess</button>
      <div id="guessFeedback" class="guess-feedback"></div>
      <div id="guessTries" class="guess-tries"></div>
      <button onclick="resetGuessGame()" class="guess-reset">Restart</button>
    </div>
  `;
  window.secretNumber = Math.floor(Math.random() * 100) + 1;
  window.guessCount = 0;
  document.getElementById('guessFeedback').textContent = '';
  document.getElementById('guessTries').textContent = '';
}

function submitGuess() {
  const input = document.getElementById('guessInput');
  const feedback = document.getElementById('guessFeedback');
  const tries = document.getElementById('guessTries');
  const guess = parseInt(input.value, 10);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = 'Please enter a number between 1 and 100.';
    feedback.style.color = '#f87171';
    return;
  }
  window.guessCount++;
  if (guess === window.secretNumber) {
    feedback.textContent = `🎉 Correct! The number was ${window.secretNumber}.`;
    feedback.style.color = '#10b981';
    tries.textContent = `Tries: ${window.guessCount}`;
  } else if (guess < window.secretNumber) {
    feedback.textContent = 'Too low! Try a higher number.';
    feedback.style.color = '#60a5fa';
    tries.textContent = `Tries: ${window.guessCount}`;
  } else {
    feedback.textContent = 'Too high! Try a lower number.';
    feedback.style.color = '#60a5fa';
    tries.textContent = `Tries: ${window.guessCount}`;
  }
  input.value = '';
}

function resetGuessGame() {
  renderGuessGame();
}

// Auto-render the game when the tab is opened
const oldOpenTab = window.openTab;
window.openTab = function(evt, tabName) {
  oldOpenTab(evt, tabName);
  if (tabName === 'game') {
    renderGuessGame();
  }
};
// If the game tab is open on load, render the game
if (document.getElementById('game').style.display !== 'none') {
  renderGuessGame();
}
