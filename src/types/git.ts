import * as vscode from "vscode";

// 定义 Git 扩展的接口，用于类型检查
export interface GitExtension {
  getAPI(version: number): GitAPI;
}

// 定义 Git API 接口
export interface GitAPI {
  repositories: Repository[];
}

// 定义 Git 仓库接口
export interface Repository {
  inputBox: InputBox;
  rootUri: vscode.Uri;
}

// 定义输入框接口
export interface InputBox {
  value: string;
}
