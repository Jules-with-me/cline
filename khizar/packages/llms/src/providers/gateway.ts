// khizar/packages/llms/src/providers/gateway.ts
import { GeminiProvider } from "./gemini-provider";
import type { IModelProvider } from "../types/provider-interfaces";

export class LLMGateway {
  static createProvider(
    providerName: "gemini" | "openai" | "anthropic",
    apiKey: string,
    modelName?: string,
    options?: any
  ): IModelProvider {
    switch (providerName) {
      case "gemini":
        return new GeminiProvider(
          apiKey,
          modelName || "gemini-2.5-flash-preview-03-25",
          options
        );
      default:
        // Default to Gemini for standard standalone Khizar setup
        return new GeminiProvider(
          apiKey,
          modelName || "gemini-2.5-flash-preview-03-25",
          options
        );
    }
  }
}
