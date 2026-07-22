const fs = require('fs');
const path = require('path');

const files = [
  '01_navigation.html',
  '02_hero.html',
  '03_trust_metrics.html',
  '04_skin_concern_finder.html',
  '05_brand_story.html',
  '06_medical_advisory_board.html',
  '07_featured_collection.html',
  '08_ingredient_story.html',
  '09_clinical_evidence.html',
  '10_curated_brands.html',
  '11_journal.html',
  '12_clinic_experience.html',
  '13_clinical_stories.html',
  '14_newsletter.html',
  '15_footer.html'
];

let componentsHtml = '';
files.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, 'homepage', file), 'utf8');
  componentsHtml += `\n<!-- START SECTION: ${file} -->\n${content}\n<!-- END SECTION: ${file} -->\n`;
});

const template = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LMCP | Luxury Medical Aesthetics & Skincare</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Prompt:wght@200;300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap" rel="stylesheet">
  
  <!-- Central Styles -->
  <link rel="stylesheet" href="variables.css">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="motion.css">
</head>
<body>
  ${componentsHtml}
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'homepage.html'), template);
fs.writeFileSync(path.join(__dirname, 'index.html'), template);
console.log('Successfully compiled homepage.html and index.html');
