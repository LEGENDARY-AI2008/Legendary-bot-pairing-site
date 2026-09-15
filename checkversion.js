const fs = require('fs');
const content = fs.readFileSync('case.js', 'utf-8');
console.log(content.includes('Prexzy API itself blocked') ? 'CURRENT VERSION ✅' : 'OLD VERSION ❌ — needs updating');