import * as vscode from "vscode";

export interface ModelQuickPickItem extends vscode.QuickPickItem {
  providerId: string;
  modelId: string;
}
