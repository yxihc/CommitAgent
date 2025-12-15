import * as vscode from "vscode";
import { localize } from "../utils/i18n";
import { getGitAPI, getSelectedRepository } from "../utils/git";
import { generateCommitMessage } from "../services/commit";
import { AIManager } from "../services/ai-manager";
import { ModelQuickPickItem } from "./types";

/**
 * 选择模型并生成提交信息命令处理器
 */
export async function handleSelectAndGenerate(...args: any[]): Promise<void> {
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

  const providers = AIManager.getProviders();
  if (providers.length === 0) {
    vscode.window.showErrorMessage(
      localize("no.providers", "No AI providers configured.")
    );
    return;
  }

  const items = buildModelQuickPickItems(providers);
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: localize("select.model", "Select AI Model"),
  });

  if (selected) {
    await generateCommitMessage(repo, {
      providerId: selected.providerId,
      modelId: selected.modelId,
    });
  }
}

function buildModelQuickPickItems(
  providers: ReturnType<typeof AIManager.getProviders>
): ModelQuickPickItem[] {
  const items: ModelQuickPickItem[] = [];

  for (const provider of providers) {
    items.push({
      label: provider.name,
      kind: vscode.QuickPickItemKind.Separator,
      providerId: provider.id,
      modelId: "",
    });

    for (const model of provider.models) {
      items.push({
        label: model.name || model.id,
        description: provider.name,
        providerId: provider.id,
        modelId: model.id,
      });
    }
  }

  return items;
}
