import * as vscode from "vscode";
import { localize } from "../utils/i18n";
import { getGitAPI, getSelectedRepository } from "../utils/git";
import { generateCommitMessage } from "../services/commit";

/**
 * 生成提交信息命令处理器
 */
export async function handleGenerate(...args: any[]): Promise<void> {
  const git = getGitAPI();
  if (!git) {
    vscode.window.showErrorMessage(
      localize("git.extension.not.found", "未找到 Git 扩展")
    );
    return;
  }

  const repo = getSelectedRepository(git, args);
  if (!repo) {
    vscode.window.showErrorMessage(
      localize("git.repo.not.found", "未找到 Git 仓库")
    );
    return;
  }

  await generateCommitMessage(repo);
}
