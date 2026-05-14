const fs = require('fs');
const { SABIAN_SYMBOLS, TAROT_DICT, MAYAN_TONES, MAYAN_TOTEMS, HD_TYPE_DICT, HD_PROFILE_DICT } = require('./lib/weightData');

// 1. Sabian
const sabianContent = `export const SABIAN_SYMBOLS: Record<number, { title: string; elementVibe: string; deepMeaning: string; advice: string }> = ${JSON.stringify(SABIAN_SYMBOLS, null, 2)};\n`;
fs.writeFileSync('./lib/data/sabianData.ts', sabianContent);

// 2. Tarot
const tarotContent = `export const TAROT_DICT: Record<number, { archetype: string; power: string; shadow: string; mission: string }> = ${JSON.stringify(TAROT_DICT, null, 2)};\n`;
fs.writeFileSync('./lib/data/tarotData.ts', tarotContent);

// 3. Mayan
const mayanContent = `export const MAYAN_TONES: string[] = ${JSON.stringify(MAYAN_TONES, null, 2)};\n
export interface MayanTotemData {
  name: string;
  desc: string;
}
export const MAYAN_TOTEMS: MayanTotemData[] = ${JSON.stringify(MAYAN_TOTEMS, null, 2)};\n`;
fs.writeFileSync('./lib/data/mayanData.ts', mayanContent);

// 4. Human Design
const hdContent = `export const HD_TYPE_DICT: Record<string, { type: string; strategy: string; signature: string; notSelf: string; spaceDeploy: string }> = ${JSON.stringify(HD_TYPE_DICT, null, 2)};\n
export const HD_PROFILE_DICT: Record<string, { profile: string; desc: string }> = ${JSON.stringify(HD_PROFILE_DICT, null, 2)};\n`;
fs.writeFileSync('./lib/data/hdData.ts', hdContent);

console.log('Files generated successfully!');
