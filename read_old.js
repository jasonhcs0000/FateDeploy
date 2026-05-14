const fs = require('fs');
const content = fs.readFileSync('fateLogic_c4baffd.ts', 'utf16le');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('HD_TYPE_DICT')) {
    console.log(`Line ${i}: \n${lines.slice(i-20, i+20).join('\n')}`);
    break;
  }
}
