import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { AIProvider, AIModel } from "../types/config";
import { AIProviderAdapter } from "./types";
import { Logger } from "../utils/logger";
export class OpenAICompatibleAdapter implements AIProviderAdapter {
  createModel(provider: AIProvider, modelId: string) {
    if (!provider.baseUrl) {
      throw new Error("OpenAI Compatible provider requires a baseUrl.");
    }
    // Validate URL format
    const baseUrl = provider.baseUrl.trim();
    // const baseUrl = "https://api-inference.modelscope.cn/v1";
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      throw new Error("Base URL must start with http:// or https://");
    }
    const openaiCompatible = createOpenAICompatible({
      name: "openai-compatible",
      apiKey: provider.apiKey,
      baseURL: baseUrl,
    });
    return openaiCompatible(modelId);
  }

  async fetchModels(provider: AIProvider): Promise<AIModel[]> {
    if (!provider.baseUrl) {
      throw new Error("Cannot fetch models without a base URL.");
    }
    const url = `${provider.baseUrl.replace(/\/$/, "")}/models`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${provider.apiKey}` },
      });
      const data = (await response.json()) as any;
      if (data.data && Array.isArray(data.data)) {
        return data.data.map((m: any) => ({
          id: m.id,
          name: m.name || m.id,
          group: m.group,
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
