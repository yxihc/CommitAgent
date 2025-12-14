import { streamText } from "ai";
import { AIManager } from "./ai-manager";
import { PromptUtils } from "../utils/prompt";
import { Logger } from "../utils/logger";
import { localize } from "../utils/i18n";

export async function generateCommitMessageStream(
  diff: string,
  onChunk: (chunk: string) => void,
  options?: { providerId?: string; modelId?: string }
): Promise<string> {
  const config = AIManager.getConfig();
  // Use existing language setting or default to zh-CN
  const language = config.language || "zh-CN";

  let provider;
  if (options?.providerId) {
    provider = AIManager.getProvider(options.providerId);
  } else {
    provider = AIManager.getDefaultProvider();
  }

  if (!provider) {
    throw new Error(
      localize(
        "no.provider.configured",
        "No AI provider configured. Please add a provider in settings."
      )
    );
  }

  let modelId = options?.modelId;
  if (!modelId) {
    modelId = AIManager.getDefaultModel(provider);
  }

  if (!modelId) {
    throw new Error(
      localize(
        "no.model.selected",
        `No model selected for provider ${provider.name}.`
      )
    );
  }

  Logger.log(
    `Generating commit message using Provider: ${provider.name}, Model: ${modelId}, Language: ${language}`
  );

  const prompt = PromptUtils.getPrompt(language, diff);
  const model = AIManager.createModel(provider, modelId);

  try {
    const result = streamText({
      model: model,
      prompt: prompt,
    });

    let fullText = "";
    let streamError: Error | null = null;
    
    // 使用 fullStream 处理带思考模型的响应
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        fullText += part.text;
        onChunk(part.text);
      } else if (part.type === "error") {
        const errMsg = part.error instanceof Error 
          ? part.error.message 
          : JSON.stringify(part.error);
        Logger.log(`Stream error: ${errMsg}`);
        streamError = part.error instanceof Error 
          ? part.error 
          : new Error(errMsg);
      }
    }
    
    if (streamError) {
      throw streamError;
    }

    // 如果 fullStream 没有文本，尝试从 result.text 获取
    if (!fullText) {
      Logger.log("No text from fullStream, trying result.text...");
      const finalText = await result.text;
      if (finalText) {
        fullText = finalText;
        onChunk(finalText);
      }
    }

    if (!fullText) {
      throw new Error("Received empty response from AI provider.");
    }

    Logger.log("Received full response from AI provider.");
    return fullText.trim();
  } catch (error: any) {
    Logger.log(`Error calling AI provider: ${error.message}`);
    throw error;
  }
}
