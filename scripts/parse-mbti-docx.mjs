// One-time authoring helper: extracts word/document.xml from the MBTI docx and
// dumps every paragraph's plain text as JSON so a human can hand-correct it
// into src/data/mbtiQuestions.ts. Not part of the app build.
import { readFile, writeFile } from 'node:fs/promises';
import JSZip from 'jszip';

const DOCX_PATH = new URL('../mbti少年版測驗題.docx', import.meta.url);
const OUT_PATH = new URL('./mbti-draft.json', import.meta.url);

const buf = await readFile(DOCX_PATH);
const zip = await JSZip.loadAsync(buf);
const xml = await zip.file('word/document.xml').async('string');

const paragraphs = [];
for (const pMatch of xml.matchAll(/<w:p[ >].*?<\/w:p>/gs)) {
  const pXml = pMatch[0];
  const text = [...pXml.matchAll(/<w:t[^>]*>(.*?)<\/w:t>/gs)]
    .map((m) => m[1])
    .join('');
  if (text.trim()) paragraphs.push(text);
}

await writeFile(OUT_PATH, JSON.stringify(paragraphs, null, 2), 'utf-8');
console.log(`Wrote ${paragraphs.length} non-empty paragraphs to ${OUT_PATH.pathname}`);
