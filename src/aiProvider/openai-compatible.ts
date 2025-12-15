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
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${provider.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        group: m.group,
      }));
    }
    return [];
  }
}
