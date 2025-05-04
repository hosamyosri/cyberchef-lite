// DOM Elements
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize Particles.js
document.addEventListener('DOMContentLoaded', () => {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: getComputedStyle(document.documentElement).getPropertyValue('--primary') },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: 'var(--primary)', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' }
        }
      }
    });
  }

  // Initialize character counter
  inputBox.addEventListener('input', updateCharCount);
  updateCharCount();

  // Initialize tool categories
  initToolCategories();

  // Initialize tab indicator
  initTabIndicator();
});

// Theme Management
function setTheme(isDark) {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.checked = isDark;
  
  // Update particles color
  if (window.pJSDom && window.pJSDom.length > 0) {
    pJSDom[0].pJS.particles.color.value = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    pJSDom[0].pJS.particles.line_linked.color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    pJSDom[0].pJS.fn.particlesRefresh();
  }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme === 'dark');

// Theme toggle event
themeToggle.addEventListener('change', (e) => {
  setTheme(e.target.checked);
});

// Character Counter
function updateCharCount() {
  const count = inputBox.value.length;
  charCount.textContent = `${count} ${count === 1 ? 'char' : 'chars'}`;
}

// Tool Categories
function initToolCategories() {
  const categories = document.querySelectorAll('.category');
  categories.forEach(category => {
    const header = category.querySelector('.category-header');
    header.addEventListener('click', () => {
      category.classList.toggle('active');
    });
  });
}

// Tab Navigation
function initTabIndicator() {
  const tabs = document.querySelectorAll('.tab');
  const tabIndicator = document.querySelector('.tab-indicator');
  const tabContents = document.querySelectorAll('.tab-content');
  
  function setActiveTab(tab) {
    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update tab contents
    const tabName = tab.dataset.tab;
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabName) {
        content.classList.add('active');
      }
    });
    
    // Update indicator
    const tabRect = tab.getBoundingClientRect();
    const containerRect = tab.parentElement.getBoundingClientRect();
    tabIndicator.style.left = `${tabRect.left - containerRect.left}px`;
    tabIndicator.style.width = `${tabRect.width}px`;
  }
  
  // Set initial active tab
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) setActiveTab(activeTab);
  
  // Add click events
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab));
  });
}

// FAB Menu
function toggleFab() {
  const fab = document.getElementById('fabMenu');
  fab.classList.toggle('active');
}

// Utility Functions
function copyOutput() {
  navigator.clipboard.writeText(outputBox.textContent)
    .then(() => showToast('Copied to clipboard!'))
    .catch(err => showToast('Failed to copy', true));
}

function clearInput() {
  inputBox.value = '';
  updateCharCount();
  showToast('Input cleared');
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Enhanced Base64 Function
function runBase64(mode) {
  try {
    if (mode === 'encode') {
      outputBox.textContent = btoa(inputBox.value);
    } else {
      outputBox.textContent = atob(inputBox.value);
    }
    showToast(`Base64 ${mode}d successfully`);
  } catch (e) {
    outputBox.textContent = `Error: ${e.message}`;
    showToast('Base64 operation failed', true);
  }
}

// Enhanced Hashing Function
async function generateHashes() {
  try {
    const input = inputBox.value;
    if (!input) {
      showToast('Please enter some text', true);
      return;
    }
    
    // SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(buffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // MD5 (using CryptoJS)
    const md5 = CryptoJS.MD5(input).toString();
    
    outputBox.textContent = `MD5: ${md5}\nSHA-256: ${sha256}`;
    showToast('Hashes generated');
  } catch (e) {
    outputBox.textContent = `Error: ${e.message}`;
    showToast('Hashing failed', true);
  }
}

// ... (Keep all your existing tool functions, but add error handling and toast notifications)

// Initialize the default game tab
if (document.getElementById('game').classList.contains('active')) {
  renderGuessGame();
}