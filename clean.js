const fs = require('fs');
let content = fs.readFileSync('scratch_iching.js', 'utf8');
content = content.replace(/hshBusinessAdvice/g, 'decisionAdvice');
fs.writeFileSync('scratch_iching.js', content);
