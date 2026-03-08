import * as deepl from 'deepl-node';
import { readFileSync, writeFileSync } from 'fs';

const authKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const filePath = process.argv[2];
let targetLang = process.argv[3];
const outputPath = process.argv[4];

if (targetLang === 'zh-CN') targetLang = 'zh';
if (targetLang === 'zh-TW') targetLang = 'zh-hant';

async function main() {
  try {
    const content = readFileSync(filePath, 'utf8');
    const result = await translator.translateText(content, null, targetLang, {
      tagHandling: 'xml',
      ignoreTags: ['code', 'pre']
    });

    let fixedText = result.text.replace(/＃/g, '#').replace(/＊/g, '*').replace(/＿/g, '_')
                              .replace(/｀/g, '`').replace(/［/g, '[').replace(/］/g, ']')
                              .replace(/｛/g, '{').replace(/｝/g, '}');

    writeFileSync(outputPath, fixedText, 'utf8');
    console.log(`  -> Saved: ${outputPath}`);
  } catch (err) {
    console.error(`  -> Error translating ${filePath}:`, err);
    process.exit(1);
  }
}
main();
