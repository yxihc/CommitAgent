import * as vscode from "vscode";

// 定义 Git 扩展的接口，用于类型检查
interface GitExtension {
  getAPI(version: number): GitAPI;
}

// 定义 Git API 接口
interface GitAPI {
  repositories: Repository[];
}

// 定义 Git 仓库接口
interface Repository {
  inputBox: InputBox;
  rootUri: vscode.Uri;
}

// 定义输入框接口
interface InputBox {
  value: string;
}

/**
 * 插件激活时调用的方法
 * @param context 扩展上下文，用于注册命令和释放资源
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('恭喜，您的扩展 "ai-generate-commit" 已激活！');

  // 注册命令 'ai-generate-commit.generate'
  // 该命令在 package.json 中被绑定到了 SCM (源代码管理) 面板的标题栏菜单
  const disposable = vscode.commands.registerCommand(
    "ai-generate-commit.generate",
    async (...args: any[]) => {
      // 获取 VS Code 内置的 Git 扩展
      const gitExtension =
        vscode.extensions.getExtension<GitExtension>("vscode.git");
      if (!gitExtension) {
        vscode.window.showErrorMessage("未找到 Git 扩展");
        return;
      }

      // 获取 Git API v1
      const git = gitExtension.exports.getAPI(1);
      if (git.repositories.length === 0) {
        vscode.window.showErrorMessage("未找到 Git 仓库");
        return;
      }

      // 默认选择第一个仓库
      let repo = git.repositories[0];

      // 尝试根据上下文参数匹配正确的仓库
      // 当从 SCM 标题栏点击按钮时，VS Code 可能会传递当前上下文对象
      if (args.length > 0) {
        const arg = args[0];
        // 如果参数中包含 rootUri，则尝试通过 rootUri 匹配仓库
        if (arg && arg.rootUri) {
          const found = git.repositories.find(
            (r) => r.rootUri.toString() === arg.rootUri.toString()
          );
          if (found) {
            repo = found;
          }
        }
      }

      // 获取当前输入框中的文本
      const currentText = repo.inputBox.value;

      // 在源代码管理 (Source Control) 面板显示进度条
      // location: vscode.ProgressLocation.SourceControl 指定进度条显示在 SCM 面板顶部
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.SourceControl,
          title: "AI 正在处理...",
        },
        async (progress) => {
          // 第一阶段：读取输入
          progress.report({ message: "正在读取输入..." });
          // 模拟处理时间
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // 第二阶段：生成提交信息
          progress.report({ message: "正在生成提交信息..." });
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // 更新输入框的逻辑
          // 这里我们只是追加一个模拟字符串，实际应用中可以替换为调用 AI 接口的逻辑
          // 如果输入框为空，则提供一个默认的提交信息
          const processedText = currentText.trim()
            ? `${currentText}\n\n(由 AI 代理处理)`
            : "feat: 实现 AI 自动生成提交信息功能";

          // 将处理后的文本赋值回 Git 输入框
          repo.inputBox.value = processedText;
        }
      );
    }
  );

  // 将命令注册添加到订阅列表中，以便在插件停用时正确释放资源
  context.subscriptions.push(disposable);
}

/**
 * 插件停用时调用的方法
 */
export function deactivate() {}
