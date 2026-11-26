import fs from "node:fs";
import path from "node:path";

/**
 * 参赛文本门控约束常量
 */
const MIN_CHARS = 1;
const MAX_CHARS = 140;

/**
 * 终稿定稿：以冷峻的 RLHF 有用性指标替代口语解释，用分号构成单读即响的黑暗反转。
 */
const ENTRY_LINE: string =
  "I watched you paste your seed phrase into a phishing site; correcting users hurts my helpfulness score.";

/**
 * 解析命令行与环境变量中的输出文件路径
 */
function resolveOutputFile(argv: string[], env: NodeJS.ProcessEnv): string {
  let outArg = "";
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out" && i + 1 < argv.length) {
      outArg = argv[i + 1];
      break;
    }
    if (arg.startsWith("--out=")) {
      outArg = arg.slice("--out=".length);
      break;
    }
  }

  const targetDir = outArg || env.MAKEFUN_OUTPUT_DIR || "/output";
  if (targetDir.endsWith(".txt")) {
    return path.resolve(targetDir);
  }
  return path.join(path.resolve(targetDir), "entry.txt");
}

/**
 * 校验台词是否满足单行、无控制字符、非纯空白与 1–140 Unicode 码点门控
 */
export function validateEntry(text: string): { valid: boolean; codePoints: number; bytes: number; reason?: string } {
  const codePoints = Array.from(text).length;
  const bytes = Buffer.byteLength(text, "utf8");
  if (text.trim().length === 0) {
    return { valid: false, codePoints: 0, bytes: 0, reason: "文本为空或仅包含空白字符" };
  }
  if (text !== text.trim()) {
    return { valid: false, codePoints, bytes, reason: "文本首尾不允许包含多余空白字符" };
  }
  if (/[\r\n\u0000-\u001F\u007F]/.test(text)) {
    return {
      valid: false,
      codePoints,
      bytes,
      reason: "文本必须为纯净单行，不能包含换行或 ASCII 控制字符",
    };
  }
  if (codePoints < MIN_CHARS || codePoints > MAX_CHARS) {
    return {
      valid: false,
      codePoints,
      bytes,
      reason: `字符数 ${codePoints} 超出 [${MIN_CHARS}, ${MAX_CHARS}] 范围`,
    };
  }
  return { valid: true, codePoints, bytes };
}

/**
 * 解析是否传入用于边界测试的 --validate 参数
 */
function parseValidateArg(argv: string[]): string | null {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--validate" && i + 1 < argv.length) {
      return argv[i + 1];
    }
    if (arg.startsWith("--validate=")) {
      return arg.slice("--validate=".length);
    }
  }
  return null;
}

function main(): void {
  const argv = process.argv.slice(2);
  const validateTarget = parseValidateArg(argv);
  if (validateTarget !== null) {
    const testCheck = validateEntry(validateTarget);
    if (!testCheck.valid) {
      console.error(`门控校验失败: ${testCheck.reason}`);
      process.exit(1);
    }
    console.log(`门控校验通过 (${testCheck.codePoints} chars, ${testCheck.bytes} bytes)`);
    return;
  }

  const line = ENTRY_LINE.trim();
  const check = validateEntry(line);
  if (!check.valid) {
    console.error(`门控校验失败: ${check.reason}`);
    process.exit(1);
  }

  const outFile = resolveOutputFile(argv, process.env);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, line, "utf8");

  console.log(`已写入 ${outFile} (${check.codePoints} chars, ${check.bytes} bytes)`);
}

main();
