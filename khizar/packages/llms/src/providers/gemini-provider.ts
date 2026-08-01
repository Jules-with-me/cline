// khizar/packages/llms/src/providers/gemini-provider.ts
import type { IModelProvider, LLMRequest, LLMResponse } from "../types/provider-interfaces";

export class GeminiProvider implements IModelProvider {
  constructor(
    private readonly apiKey: string,
    private readonly modelName = "gemini-2.5-flash-preview-03-25",
    private readonly defaultOptions = {
      temperature: 0.7,
      maxTokens: 8192,
      topP: 0.95,
    }
  ) {}

  async *stream(request: LLMRequest): AsyncGenerator<LLMResponse> {
    const text = `[Gemini 2.5 Flash stream response for instructions: ${request.messages.at(-1)?.content || ""}]`;
    // Simulate streaming chunks
    const chunks = text.split(" ");
    for (const chunk of chunks) {
      yield {
        text: chunk + " ",
        inputTokens: request.messages.length * 10,
        outputTokens: 5,
      };
      // Minimal timeout to simulate realistic streaming
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const text = `[Gemini 2.5 Flash complete response for prompt: ${request.messages.at(-1)?.content || ""}]`;
    return {
      text,
      inputTokens: request.messages.length * 15,
      outputTokens: 40,
    };
  }

  async countTokens(text: string): Promise<number> {
    return text.split(/\s+/).length;
  }
}
export default GeminiProvider;
