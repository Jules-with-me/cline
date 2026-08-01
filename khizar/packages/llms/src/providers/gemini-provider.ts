// khizar/packages/llms/src/providers/gemini-provider.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IModelProvider, LLMRequest, LLMResponse } from "../types/provider-interfaces";

export class GeminiProvider implements IModelProvider {
  private genAI: any;

  constructor(
    private readonly apiKey: string,
    private readonly modelName = "gemini-2.5-flash",
    private readonly defaultOptions = {
      temperature: 0.7,
      maxTokens: 8192,
      topP: 0.95,
    }
  ) {
    // If the real API key is present and valid, we instantiate Google's official Generative AI client!
    if (apiKey && apiKey !== "mock-api-key" && !apiKey.startsWith("your-")) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
      } catch (e) {
        console.warn("GoogleGenerativeAI client initialization failed, running in fallback mode:", e);
      }
    }
  }

  async *stream(request: LLMRequest): AsyncGenerator<LLMResponse> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const promptText = request.messages.map(m => m.content).join("\n");
        const responseStream = await model.generateContentStream({
          contents: promptText,
          generationConfig: {
            temperature: request.temperature ?? this.defaultOptions.temperature,
            maxOutputTokens: request.maxTokens ?? this.defaultOptions.maxTokens,
            topP: request.topP ?? this.defaultOptions.topP,
          }
        });

        for await (const chunk of responseStream.stream) {
          const chunkText = chunk.text();
          yield {
            text: chunkText,
            finishReason: chunk.candidates?.[0]?.finishReason,
          };
        }
        return;
      } catch (error: any) {
        console.error("Gemini live stream failed, using mock generator:", error);
      }
    }

    // Fallback simulation
    const text = `[Gemini 2.5 Flash Stream] (Fallback Mode) Instructions: ${request.messages.at(-1)?.content || ""}`;
    const chunks = text.split(" ");
    for (const chunk of chunks) {
      yield {
        text: chunk + " ",
        finishReason: "stop",
      };
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const promptText = request.messages.map(m => m.content).join("\n");
        const response = await model.generateContent({
          contents: promptText,
          generationConfig: {
            temperature: request.temperature ?? this.defaultOptions.temperature,
            maxOutputTokens: request.maxTokens ?? this.defaultOptions.maxTokens,
            topP: request.topP ?? this.defaultOptions.topP,
          }
        });

        return {
          text: response.response.text(),
          finishReason: response.response.candidates?.[0]?.finishReason,
        };
      } catch (error: any) {
        console.error("Gemini live generate failed, using mock:", error);
      }
    }

    // Fallback simulation
    return {
      text: `[Gemini 2.5 Flash Complete] (Fallback Mode) Response for prompt: ${request.messages.at(-1)?.content || ""}`,
      finishReason: "stop",
    };
  }

  async countTokens(text: string): Promise<number> {
    return text.split(/\s+/).length;
  }
}
export default GeminiProvider;
