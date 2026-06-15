const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, 'content/recipes/en');
const arDir = path.join(__dirname, 'content/recipes/ar');

const enFiles = fs.readdirSync(enDir).filter(f => f.includes('frappe.md'));
enFiles.forEach(f => {
  const filePath = path.join(enDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Update Ingredients Table
  if (!content.includes('Frappe Base Powder')) {
    content = content.replace('|---|---|', '|---|---|\n| Frappe Base Powder | 30g - 40g (1.5 - 2 scoops) |');
  }

  // 2. Update Blender Steps
  // Match "1. **150 ml whole milk** (first — protects blades)" or similar and insert after it.
  // The regex finds the first item in the Sonifer Blender list that contains "milk" or "oat milk".
  if (!content.includes('Frappe Base Powder (30g - 40g)')) {
    content = content.replace(/(\d+\.\s+\*\*.*?[mM]ilk.*?\n)/, '$12. **Frappe Base Powder (30g - 40g)** (adds texture and prevents separation)\n');
  }

  // 3. Remove separation text
  content = content.replace(/— frappes separate after \*\*3–5 minutes\*\*\./g, '.');
  content = content.replace(/— frappes separate after \*\*3-5 minutes\*\*\./g, '.');
  content = content.replace(/— frappes separate after \*\*3–5 minutes\*\*/g, '');
  content = content.replace(/— frappes separate after \*\*3-5 minutes\*\*/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Updated EN: ${f}`);
});

const arFiles = fs.readdirSync(arDir).filter(f => f.includes('frappe.md'));
arFiles.forEach(f => {
  const filePath = path.join(arDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Update Ingredients Table
  if (!content.includes('بودرة فرابيه أساسية')) {
    content = content.replace('|---|---|', '|---|---|\n| بودرة فرابيه أساسية | 30 - 40 جرام (1.5 - 2 سكوب) |');
  }

  // 2. Update Blender Steps
  if (!content.includes('بودرة فرابيه أساسية (30 - 40 جرام)')) {
    content = content.replace(/(\d+\.\s+\*\*.*?حليب.*?\n)/, '$12. **بودرة فرابيه أساسية (30 - 40 جرام)** (لتحسين القوام ومنع الانفصال)\n');
  }

  // 3. Remove separation text
  content = content.replace(/— يبدأ الفرابيه بالتفريق بعد \*\*3 – 5 دقائق\*\*\./g, '.');
  content = content.replace(/— يبدأ الفرابيه بالتفريق بعد \*\*3-5 دقائق\*\*\./g, '.');
  content = content.replace(/— يبدأ الفرابيه بالتفريق بعد \*\*3 – 5 دقائق\*\*/g, '');
  content = content.replace(/— يبدأ الفرابيه بالتفريق بعد \*\*3-5 دقائق\*\*/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Updated AR: ${f}`);
});
