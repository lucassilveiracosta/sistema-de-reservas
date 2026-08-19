const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.tsx') || filepath.endsWith('.ts') || filepath.endsWith('.css')) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
};

const dirsToRefactor = [
  path.join(__dirname, 'frontend', 'src', 'app'),
  path.join(__dirname, 'frontend', 'src', 'components')
];

let files = [];
dirsToRefactor.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = files.concat(walkSync(dir));
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Colors
  content = content.replace(/indigo-/g, 'blue-');
  
  // Gradients and Glassmorphism (specifically Landing and Login)
  content = content.replace(/bg-gradient-to-br from-blue-50 to-blue-100/g, 'bg-slate-50');
  content = content.replace(/bg-white\/60 backdrop-blur-xl border border-white\/50/g, 'bg-white border border-slate-200');
  content = content.replace(/bg-white\/50/g, 'bg-white');
  content = content.replace(/backdrop-blur-sm/g, 'bg-slate-900/60'); // keep modal backdrop slightly dark but not blurred (glassmorphism reduction)
  
  // Shapes
  content = content.replace(/rounded-3xl/g, 'rounded-lg');
  content = content.replace(/rounded-2xl/g, 'rounded-md');
  content = content.replace(/rounded-xl/g, 'rounded-md');
  // Be careful with rounded-full, some might be circles. Let's change rounded-full to rounded-md ONLY if it's on a button or link.
  // Actually, a simpler regex for buttons:
  content = content.replace(/rounded-full/g, 'rounded-md');
  // Fix specific circles that need to stay circles
  content = content.replace(/w-8 h-8 rounded-md/g, 'w-8 h-8 rounded-full');
  content = content.replace(/w-16 h-16 bg-red-100 text-red-600 rounded-md/g, 'w-16 h-16 bg-red-100 text-red-600 rounded-full');

  // Shadows
  content = content.replace(/shadow-2xl/g, 'shadow-lg');
  content = content.replace(/shadow-blue-500\/30/g, 'shadow-slate-200');
  content = content.replace(/shadow-blue-500\/10/g, 'shadow-slate-100');
  content = content.replace(/shadow-blue-500\/5/g, 'shadow-slate-100');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Refactored ${file}`);
});
