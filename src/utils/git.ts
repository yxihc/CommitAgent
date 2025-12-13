import * as vscode from "vscode";
import { simpleGit } from "simple-git";
import { GitExtension, GitAPI, Repository } from "../types/git";

/**
 * 获取 VS Code 内置的 Git 扩展
 */
export function getGitExtension(): vscode.Extension<GitExtension> | undefined {
  return vscode.extensions.getExtension<GitExtension>("vscode.git");
}

/**
 * 获取 Git API v1
 */
export function getGitAPI(): GitAPI | undefined {
  const extension = getGitExtension();
  if (!extension) {
    return undefined;
  }
  return extension.exports.getAPI(1);
}

/**
 * 获取当前选中的 Git 仓库
 * @param git Git API 实例
 * @param args 命令参数，可能包含上下文信息
 */
export function getSelectedRepository(
  git: GitAPI,
  args: any[]
): Repository | undefined {
  if (git.repositories.length === 0) {
    return undefined;
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

  return repo;
}

/**
 * 获取 Diff 信息
 * @param repo Git 仓库实例
 */
export async function getDiff(
  repo: Repository
): Promise<{ staged: string; working: string }> {
  if (!repo.rootUri) {
    return { staged: "", working: "" };
  }
  try {
    const git = simpleGit(repo.rootUri.fsPath);
    const [staged, working] = await Promise.all([
      git.diff(["--cached"]),
      git.diff(),
    ]);
    return { staged, working };
  } catch (error) {
    console.error("Error getting diff:", error);
    return { staged: "", working: "" };
  }
}

/**
 * 获取暂存区的 diff 信息 (兼容性包装)
 * @param repo Git 仓库实例
 */
export async function getStagedDiff(repo: Repository): Promise<string> {
  const { staged } = await getDiff(repo);
  return staged;
}
