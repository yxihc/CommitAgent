# AI Generate Commit

一个使用 AI 生成 git 提交信息的 VS Code 扩展。

## 核心功能
- 根据 git diff（暂存区或工作区）生成符合 Conventional Commits 规范的提交信息
- 支持多种 AI 提供商：OpenAI、OpenAI 兼容接口、Gemini、Claude、DeepSeek
- 流式响应，实时显示在 SCM 输入框中
- 多语言支持（中文和英文）
- 支持通过工作区 `.ai-generate-commit-rules/` 目录自定义提示词规则
- 提供 Webview 设置面板配置 AI 提供商

## 用户工作流程
1. 暂存更改或在工作区有未暂存的更改
2. 点击 SCM 面板中的 ✨ 图标（或先选择模型）
3. AI 分析 diff 并将生成的提交信息流式输出到输入框

## 提示词机制
系统始终使用内置提示词模板（`prompt/{language}.md`）作为基础，额外规则会附加到系统提示词中。

### 额外规则优先级（高到低）
1. **工作区规则**（最高优先级）
   - 目录：`.ai-generate-commit-rules/`
   - 读取目录下所有 `.md` 文件内容
   
2. **自定义提示词**
   - 配置项：`ai-generate-commit.customPrompt`
   - 可在设置面板或 VS Code 设置中配置

### 最终提示词结构
```
[系统内置提示词]

## Additional Rules
[工作区规则 或 自定义提示词]

Diff:
[git diff 内容]
```
