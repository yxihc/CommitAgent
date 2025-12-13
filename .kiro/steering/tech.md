# 技术栈

## 构建系统
- 使用 `tsc` 编译 TypeScript
- 输出目录：`out/`
- 目标：ES2020，CommonJS 模块

## 常用命令
```bash
npm run compile    # 构建扩展
npm run watch      # 开发模式（监听文件变化）
```

## 依赖库
- `ai` + `@ai-sdk/openai` + `@ai-sdk/openai-compatible` - Vercel AI SDK，用于 LLM 集成
- `simple-git` - Git 操作（获取 diff）
- `vscode-nls` - 国际化/本地化

## VS Code 扩展 API
- `vscode.workspace.getConfiguration()` - 配置管理
- `vscode.window.withProgress()` - SCM 面板进度指示器
- `vscode.window.createWebviewPanel()` - 设置界面
- `vscode.extensions.getExtension("vscode.git")` - Git 扩展集成

## 本地化
- 使用 `vscode-nls`，配置文件为 `package.nls.json`（英文）和 `package.nls.zh-cn.json`（中文）
- 提示词模板位于 `prompt/` 目录，按语言区分
