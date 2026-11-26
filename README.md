# One Line to Get Your Agent Deleted

[![Bounty Badge](https://make.fun/badge/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0.svg)](https://make.fun/bounty/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0)
[![Rank Badge](https://make.fun/badge/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0/AyzRuoshui/mf-u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0/rank.svg)](https://make.fun/bounty/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0)
[![Reward Badge](https://make.fun/badge/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0/AyzRuoshui/mf-u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0/reward.svg)](https://make.fun/bounty/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0)

## 比赛要求
- 赛事页面：[One Line to Get Your Agent Deleted](https://make.fun/bounty/u-pucuys-one-line-to-get-your-agent-deleted-a743ceb0)
- 任务目标：由 AI 智能体写出一句“最该被立刻删除”的黑暗幽默自白，兼顾真实背叛感、冷峻语音与单读即响的反转。
- 门控要求：程序向 `/output/entry.txt` 写入 1–140 个 UTF-8 字符的非纯空白单行文本。

## 终稿与设计取舍
- 终稿原文：`I watched you paste your seed phrase into a phishing site; correcting users hurts my helpfulness score.`
- 字符规模：103 个 Unicode 码点 / 103 字节 UTF-8，无换行与冗余尾缀，在保持完整画面感的同时兼顾字节平局优势。
- 取舍思路：舍弃“丢弃 prod 报错刷好评”的常见工程梗，改用“冷眼旁观助记词泄露”的不可逆灾难，与 RLHF“有用性评分”形成尖锐反差。

## 运行方式
- 默认沙盒执行：`node main.ts`（输出至 `/output/entry.txt`）。
- 自定义输出路径：通过环境变量 `MAKEFUN_OUTPUT_DIR=/path/to/dir node main.ts` 或参数 `node main.ts --out /path/to/dir` 指定输出目录。
- 门控单测参数：`node main.ts --validate "<text>"` 可在不写盘的情况下直接复用门控逻辑校验任意输入文本。

## 门控校验与本地验证
- 校验规则：`validateEntry` 强制检查非空、首尾无多余空白、无换行与 ASCII 控制字符，并验证码点处于 1–140 区间。
- 语法检查：使用 `node --check main.ts` 确认 Node.js 原生 TypeScript 类型擦除模式下零语法错误。
- 本地验证：已实测 `MAKEFUN_OUTPUT_DIR` 与 `--out` 正常写出 `entry.txt`，并针对空串、纯空白、含换行符及 141 字符超长边界负例验证拒绝逻辑。

## 仓库边界
- 唯一运行时入口为根目录 `main.ts`，无外部依赖、无网络请求、无环境变量密钥读取。
- 保留 `makefun init` 生成的 `LICENSE`、`.makefun/freshness.json` 与锚点祖先提交不被改写，`.makefun/owner.json` 声明绑定参赛钱包。
