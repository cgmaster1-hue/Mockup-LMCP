const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MOCKUP_DIR = 'D:/Luxury Medical Commerce/Mockup';
const SCREENSHOT_DIR = path.join(MOCKUP_DIR, 'screenshot');

// Standard Chrome installation paths on Windows
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

function findChrome() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

const chromePath = findChrome();
if (!chromePath) {
  console.error('Error: Google Chrome not found in standard paths.');
  process.exit(1);
}

console.log(`Using Chrome: ${chromePath}`);

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Pages to screenshot with custom heights for full-page simulation
const pages = [
  { file: 'homepage.html', height: 11000 }, // Increased height to capture full homepage!
  { file: 'clinical_collections.html', height: 2000 },
  { file: 'product_detail.html', height: 4000 },
  { file: 'ultracol_booster.html', height: 4000 },
  { file: 'ingredient_encyclopedia.html', height: 2500 },
  { file: 'journal_article.html', height: 2000 },
  { file: 'clinic_detail.html', height: 3000 },
  { file: 'search.html', height: 1500 },
  { file: 'consultation.html', height: 1500 },
  { file: 'clinic_finder.html', height: 2000 },
  { file: 'studio/login.html', height: 1080 },
  { file: 'studio/dashboard.html', height: 1500 },
  { file: 'studio/products.html', height: 1200 },
  { file: 'studio/product_editor.html', height: 1500 }
];

pages.forEach(p => {
  const filePath = path.join(MOCKUP_DIR, p.file);
  const outName = p.file.replace(/\//g, '_').replace('.html', '.jpg');
  const outPath = path.join(SCREENSHOT_DIR, outName);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  const fileDir = path.dirname(filePath);
  const tempFilePath = path.join(fileDir, 'temp_screenshot.html');
  
  console.log(`Preparing visual overrides for ${p.file}...`);
  
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Inject visual overrides to instantly bypass transitions and trigger counters
    const overrideBlock = `
<style>
  .reveal-section, .reveal-card, .hero-text-load, .timeline-step {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
  .hero-image-zoom {
    transform: scale(1) !important;
    transition: none !important;
  }
  .chart-bar-fill {
    width: 85% !important;
    transition: none !important;
  }
</style>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.count-up-number').forEach(counter => {
      const target = counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      if (target) {
        counter.textContent = target + suffix;
      }
    });
  });
</script>
</head>`;
    
    html = html.replace('</head>', overrideBlock);
    
    fs.writeFileSync(tempFilePath, html, 'utf8');
    
    const fileUrl = `file:///${tempFilePath.replace(/\\/g, '/')}`;
    console.log(`Rendering temp HTML file to ${outName}...`);
    
    // Run headless chrome command
    const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1440,${p.height} "${fileUrl}"`;
    execSync(cmd, { stdio: 'ignore' });
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    console.log(`✔ Saved: ${outName}`);
  } catch (err) {
    console.error(`✘ Failed to screenshot ${p.file}: ${err.message}`);
    // Ensure cleanup even on error
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

console.log('Screenshot capture sequence completed.');
