/**
 * Generate PWA icons as placeholders
 * Run with: node generate-icons.js
 * 
 * For production, replace these with actual icons:
 * - Use a logo designer or Canva to create proper icons
 * - Upload to pwa-asset-generator: https://www.pwabuilder.com/
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple canvas-based icon generator
function generateIcon(size, isMaskable = false) {
  const canvasObj = createCanvas(size, size);
  const ctx = canvasObj.getContext('2d');

  // Background (gradient)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#0f172a'); // slate-900
  gradient.addColorStop(1, '#1e293b'); // slate-800
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Circle (for maskable icon)
  if (isMaskable) {
    ctx.fillStyle = '#3b82f6'; // blue-500
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Text/Icon - "D" for Dukanbill
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('D', size / 2, size / 2);

  return canvasObj;
}

// Generate icons
const sizes = [192, 512];
const variants = [
  { name: 'pwa', maskable: false },
  { name: 'pwa', maskable: true }
];

console.log('🎨 Generating PWA icons...\n');

sizes.forEach(size => {
  // Non-maskable icon
  const icon = generateIcon(size, false);
  const buffer = icon.toBuffer('image/png');
  const filename = path.join(publicDir, `pwa-${size}x${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Generated: pwa-${size}x${size}.png`);

  // Maskable icon
  const maskableIcon = generateIcon(size, true);
  const maskableBuffer = maskableIcon.toBuffer('image/png');
  const maskableFilename = path.join(publicDir, `pwa-${size}x${size}-maskable.png`);
  fs.writeFileSync(maskableFilename, maskableBuffer);
  console.log(`✅ Generated: pwa-${size}x${size}-maskable.png`);
});

// Create placeholder favicon and apple-touch-icon
console.log('\n✅ Creating additional icons...');

const favicon = generateIcon(64, false);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon.toBuffer('image/png'));
console.log('✅ Generated: favicon.ico');

const appleTouchIcon = generateIcon(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon.toBuffer('image/png'));
console.log('✅ Generated: apple-touch-icon.png');

// Create SVG mask icon
const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <circle cx="96" cy="96" r="96" fill="#0f172a"/>
  <text x="96" y="110" font-size="100" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="Arial">D</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), svgContent);
console.log('✅ Generated: masked-icon.svg');

// Create screenshots directory
const screenshotsDir = path.join(publicDir, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('✅ Created: screenshots/ directory');
}

console.log('\n🚀 Icon generation complete!');
console.log('\n📝 IMPORTANT: These are placeholder icons.');
console.log('For production, replace with real icons:');
console.log('  • Use Canva, Figma, or a designer');
console.log('  • Use pwabuilder.com to generate all sizes');
console.log('  • Add screenshots to public/screenshots/\n');
