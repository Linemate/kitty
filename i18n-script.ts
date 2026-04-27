import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.{ts,tsx}");
const koPath = "src/locales/ko.json";
const enPath = "src/locales/en.json";

let koDict: Record<string, string> = {};
let enDict: Record<string, string> = {};

if (fs.existsSync(koPath)) koDict = JSON.parse(fs.readFileSync(koPath, "utf-8"));
if (fs.existsSync(enPath)) enDict = JSON.parse(fs.readFileSync(enPath, "utf-8"));

let filesChanged = 0;

sourceFiles.forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  if (filePath.includes("utils/stores.ts") || filePath.includes("utils/i18n.ts") || filePath.includes("locales/") || filePath.includes("i18n-script.ts")) return;

  let hasKorean = false;

  const processText = (text: string) => {
    if (/[가-힣]/.test(text)) {
      const trimmed = text.trim().replace(/\n/g, "\\n");
      if (!koDict[trimmed]) koDict[trimmed] = trimmed;
      if (!enDict[trimmed]) enDict[trimmed] = trimmed;
      return trimmed;
    }
    return null;
  };

  // StringLiterals
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  stringLiterals.forEach(str => {
    if (str.getParent()?.getKind() === SyntaxKind.ImportDeclaration) return;
    if (str.getParent()?.getKind() === SyntaxKind.CallExpression) {
        const caller = str.getParentIfKind(SyntaxKind.CallExpression);
        if (caller?.getExpression().getText() === 't') return;
    }

    const val = str.getLiteralValue();
    const key = processText(val);
    
    if (key) {
      hasKorean = true;
      const parent = str.getParent();
      
      if (parent && parent.getKind() === SyntaxKind.JsxAttribute) {
        const attr = parent.asKind(SyntaxKind.JsxAttribute);
        if (attr && attr.getInitializer() === str) {
            str.replaceWithText(`{t("${key}")}`);
        }
      } else {
        str.replaceWithText(`t("${key}")`);
      }
    }
  });

  // JsxText
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  jsxTexts.forEach(jsxText => {
    const text = jsxText.getLiteralText();
    if (/[가-힣]/.test(text)) {
      const key = processText(text);
      if (key) {
        hasKorean = true;
        // Check if there are variables inside the text? JsxText does not contain expressions, JsxExpression does.
        jsxText.replaceWithText(`{t("${key}")}`);
      }
    }
  });

  if (hasKorean) {
    filesChanged++;
    const hasImport = sourceFile.getImportDeclarations().some(imp => imp.getModuleSpecifierValue().includes("utils/i18n"));
    if (!hasImport) {
        sourceFile.addImportDeclaration({
            namedImports: ["t"],
            moduleSpecifier: "utils/i18n"
        });
    }
    sourceFile.saveSync();
  }
});

fs.writeFileSync(koPath, JSON.stringify(koDict, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enDict, null, 2));

console.log(`Processed ${filesChanged} files.`);
