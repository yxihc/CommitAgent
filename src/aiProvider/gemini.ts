import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { AIProvider, AIModel } from "../types/config";
import { AIProviderAdapter } from "./types";
import { Logger } from "../utils/logger";

export class GeminiAdapter implements AIProviderAdapter {
  createModel(provider: AIProvider, modelId: string) {
    const google = createGoogleGenerativeAI({
      apiKey: provider.apiKey,
      baseURL: provider.baseUrl,
    });
    return google(modelId);
  }

  async fetchModels(provider: AIProvider): Promise<AIModel[]> {
    const baseUrl =
      provider.baseUrl || "https://generativelanguage.googleapis.com/v1beta";
    const url = `${baseUrl.replace(/\/$/, "")}/models?key=${provider.apiKey}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as any;
      if (data.models && Array.isArray(data.models)) {
        return data.models.map((m: any) => ({
          id: m.name?.replace("models/", "") || m.name,
          name: m.displayName || m.name,
        }));
      } else {
        throw new Error(JSON.stringify(data));
      }
    } catch (error: any) {
      // 可以在这里做错误上报、显示用户提示等
      throw error; // 如果调用者也需要处理，可以重新抛出
    }
  }
}
