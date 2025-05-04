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

// URL Encode
function urlEncode() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = encodeURIComponent(input);
}

// HTML Encode/Decode
function htmlEncode() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = input.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c]));
}
function htmlDecode() {
  const input = document.getElementById("inputBox").value;
  const txt = document.createElement('textarea');
  txt.innerHTML = input;
  document.getElementById("outputBox").textContent = txt.value;
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

// Game Switcher
function switchGame() {
  const selector = document.getElementById('gameSelector');
  if (selector.value === 'guess') {
    renderGuessGame();
  } else if (selector.value === 'memory') {
    renderMemoryGame();
  }
}

// Memory Flip Game
function renderMemoryGame() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = `
    <div class="memory-game-container">
      <p class="memory-game-desc">Flip the cards and match all pairs!</p>
      <div class="memory-board" id="memoryBoard"></div>
      <div class="memory-status" id="memoryStatus"></div>
      <button onclick="resetMemoryGame()" class="memory-reset">Restart</button>
    </div>
  `;
  startMemoryGame();
}

function startMemoryGame() {
  const symbols = ['🍕','🍔','🍟','🌮','🍣','🍩','🍪','🍦'];
  let cards = symbols.concat(symbols); // 8 pairs
  cards = shuffle(cards);
  const board = document.getElementById('memoryBoard');
  board.innerHTML = '';
  window.memoryFlipped = [];
  window.memoryMatched = [];
  window.memoryTries = 0;
  window.memoryLock = false;
  cards.forEach((symbol, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.dataset.idx = idx;
    card.onclick = function() { flipMemoryCard(card); };
    card.innerHTML = '<span class="memory-card-inner"></span>';
    board.appendChild(card);
  });
  document.getElementById('memoryStatus').textContent = '';
}

function flipMemoryCard(card) {
  if (window.memoryLock) return;
  if (card.classList.contains('matched') || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  card.querySelector('.memory-card-inner').textContent = card.dataset.symbol;
  window.memoryFlipped.push(card);
  if (window.memoryFlipped.length === 2) {
    window.memoryLock = true;
    window.memoryTries++;
    setTimeout(() => {
      const [c1, c2] = window.memoryFlipped;
      if (c1.dataset.symbol === c2.dataset.symbol) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        window.memoryMatched.push(c1, c2);
        if (window.memoryMatched.length === 16) {
          document.getElementById('memoryStatus').textContent = `🎉 You matched all pairs in ${window.memoryTries} tries!`;
        }
      } else {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.querySelector('.memory-card-inner').textContent = '';
        c2.querySelector('.memory-card-inner').textContent = '';
      }
      window.memoryFlipped = [];
      window.memoryLock = false;
    }, 800);
  }
}

function resetMemoryGame() {
  renderMemoryGame();
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Patch openTab to render the correct game
const oldOpenTab2 = window.openTab;
window.openTab = function(evt, tabName) {
  oldOpenTab2(evt, tabName);
  if (tabName === 'game') {
    const selector = document.getElementById('gameSelector');
    if (selector.value === 'memory') {
      renderMemoryGame();
    } else {
      renderGuessGame();
    }
  }
};
// If the game tab is open on load, render the selected game
if (document.getElementById('game').style.display !== 'none') {
  const selector = document.getElementById('gameSelector');
  if (selector && selector.value === 'memory') {
    renderMemoryGame();
  } else {
    renderGuessGame();
  }
}

// Base32 Encode/Decode
function base32(mode) {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  if (mode === 'encode') {
    let bits = '', result = '';
    for (let i = 0; i < input.length; i++) bits += input[i].charCodeAt(0).toString(2).padStart(8, '0');
    for (let i = 0; i < bits.length; i += 5) {
      const chunk = bits.substr(i, 5);
      if (chunk.length < 5) result += alphabet[parseInt(chunk.padEnd(5, '0'), 2)];
      else result += alphabet[parseInt(chunk, 2)];
    }
    output.textContent = result;
  } else {
    let bits = '', result = '';
    for (let c of input.replace(/=+$/, '')) {
      const idx = alphabet.indexOf(c.toUpperCase());
      if (idx === -1) continue;
      bits += idx.toString(2).padStart(5, '0');
    }
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.substr(i, 8);
      if (byte.length === 8) result += String.fromCharCode(parseInt(byte, 2));
    }
    output.textContent = result;
  }
}

// Hex Encode/Decode
function hex(mode) {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  if (mode === 'encode') {
    output.textContent = Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  } else {
    let hexStr = input.replace(/[^0-9a-f]/gi, '');
    let str = '';
    for (let i = 0; i < hexStr.length; i += 2) str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    output.textContent = str;
  }
}

// Binary Encode/Decode
function binary(mode) {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  if (mode === 'encode') {
    output.textContent = Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  } else {
    output.textContent = input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
  }
}

// Case Converter
function caseConvert(mode) {
  const input = document.getElementById("inputBox").value;
  if (mode === 'upper') document.getElementById("outputBox").textContent = input.toUpperCase();
  else if (mode === 'lower') document.getElementById("outputBox").textContent = input.toLowerCase();
  else document.getElementById("outputBox").textContent = input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
}

// Remove Duplicates
function removeDuplicates() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = Array.from(new Set(input.split('\n'))).join('\n');
}

// Sort Lines
function sortLines() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = input.split('\n').sort().join('\n');
}

// Word/Char Counter
function countWordsChars() {
  const input = document.getElementById("inputBox").value;
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  document.getElementById("outputBox").textContent = `Words: ${words}\nChars: ${chars}`;
}

// Trim Whitespace
function trimWhitespace() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = input.split('\n').map(l => l.trim()).join('\n');
}

// Extra Hashes
function generateHashesExtra() {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  const sha1 = CryptoJS.SHA1(input).toString();
  const sha512 = CryptoJS.SHA512(input).toString();
  const ripemd = CryptoJS.RIPEMD160(input).toString();
  output.textContent = `SHA-1: ${sha1}\nSHA-512: ${sha512}\nRIPEMD160: ${ripemd}`;
}

// JWT Decoder
function jwtDecode() {
  const input = document.getElementById("inputBox").value;
  const output = document.getElementById("outputBox");
  try {
    const parts = input.split(".");
    if (parts.length < 2) throw new Error("Invalid JWT format");
    const decode = (str) => decodeURIComponent(atob(str.replace(/-/g, "+").replace(/_/g, "/")).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    const header = JSON.stringify(JSON.parse(decode(parts[0])), null, 2);
    const payload = JSON.stringify(JSON.parse(decode(parts[1])), null, 2);
    output.textContent = `Header:\n${header}\n\nPayload:\n${payload}`;
  } catch (e) {
    output.textContent = "⚠️ Error decoding JWT: " + e.message;
  }
}

// Regex Extractor
function extractRegex() {
  const text = document.getElementById("inputBox").value;
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const ips = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  const result = `Emails:\n${emails.join("\n") || "None"}\n\nIPs:\n${ips.join("\n") || "None"}\n\nURLs:\n${urls.join("\n") || "None"}`;
  document.getElementById("outputBox").textContent = result;
}

// UUID Generator
function uuidGen() {
  const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  document.getElementById("outputBox").textContent = uuid;
}

// Timestamp to Date
function timestampToDate() {
  const input = document.getElementById("inputBox").value.trim();
  const ts = parseInt(input, 10);
  if (isNaN(ts)) {
    document.getElementById("outputBox").textContent = "Invalid timestamp.";
    return;
  }
  const date = new Date(ts * 1000);
  document.getElementById("outputBox").textContent = date.toISOString();
}
// Date to Timestamp
function dateToTimestamp() {
  const input = document.getElementById("inputBox").value.trim();
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    document.getElementById("outputBox").textContent = "Invalid date.";
    return;
  }
  document.getElementById("outputBox").textContent = Math.floor(date.getTime() / 1000);
}

// String Reverser
function reverseString() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = input.split('').reverse().join('');
}

// ROT13
function rot13() {
  const input = document.getElementById("inputBox").value;
  document.getElementById("outputBox").textContent = input.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
}

// JSON Formatter/Minifier
function jsonFormat() {
  const input = document.getElementById("inputBox").value;
  try {
    document.getElementById("outputBox").textContent = JSON.stringify(JSON.parse(input), null, 2);
  } catch (e) {
    document.getElementById("outputBox").textContent = "Invalid JSON.";
  }
}
function jsonMinify() {
  const input = document.getElementById("inputBox").value;
  try {
    document.getElementById("outputBox").textContent = JSON.stringify(JSON.parse(input));
  } catch (e) {
    document.getElementById("outputBox").textContent = "Invalid JSON.";
  }
}

// CSV to JSON
function csvToJson() {
  const input = document.getElementById("inputBox").value;
  const lines = input.split('\n').filter(Boolean);
  if (lines.length < 2) {
    document.getElementById("outputBox").textContent = "Need at least header and one row.";
    return;
  }
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i]||'').trim());
    return obj;
  });
  document.getElementById("outputBox").textContent = JSON.stringify(data, null, 2);
}

// Random Password Generator
function randomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let pass = '';
  for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  document.getElementById("outputBox").textContent = pass;
}

// Morse Code Encode/Decode
const morseMap = {A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
const morseMapRev = Object.fromEntries(Object.entries(morseMap).map(([k,v])=>[v,k]));
function morse(mode) {
  const input = document.getElementById("inputBox").value;
  if (mode === 'encode') {
    document.getElementById("outputBox").textContent = input.toUpperCase().split('').map(c => morseMap[c] || (c === ' ' ? '/' : '')).join(' ');
  } else {
    document.getElementById("outputBox").textContent = input.split(' ').map(m => m === '/' ? ' ' : (morseMapRev[m] || '?')).join('');
  }
}

// Color Converter (HEX <-> RGB)
function colorConvert() {
  const input = document.getElementById("inputBox").value.trim();
  let out = '';
  if (/^#?([a-f\d]{6})$/i.test(input)) {
    let hex = input.replace('#','');
    out = `rgb(${parseInt(hex.substr(0,2),16)},${parseInt(hex.substr(2,2),16)},${parseInt(hex.substr(4,2),16)})`;
  } else if (/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i.test(input)) {
    let m = input.match(/\d+/g);
    out = '#' + m.map(x => (+x).toString(16).padStart(2,'0')).join('');
  } else {
    out = 'Input as #RRGGBB or rgb(r,g,b)';
  }
  document.getElementById("outputBox").textContent = out;
}
