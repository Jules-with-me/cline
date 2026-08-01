// khizar/packages/llms/src/types/provider-interfaces.ts

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  tools?: any[];
}

export interface LLMResponse {
  text: string;
  finishReason?: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface IModelProvider {
  stream(request: LLMRequest): AsyncGenerator<LLMResponse>;
  generate(request: LLMRequest): Promise<LLMResponse>;
  countTokens(text: string): Promise<number>;
}
