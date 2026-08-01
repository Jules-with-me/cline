// khizar/packages/core/src/config/ai-config.ts

export interface AIConfig {
  provider: "gemini" | "openai" | "anthropic";
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  systemPrompt: string;
  codeGeneration: {
    maxFilesPerRequest: number;
    maxLinesPerFile: number;
    includeExplanations: boolean;
    autoApply: boolean;
  };
  security: {
    requireApproval: boolean;
    maxRetries: number;
    timeout: number;
  };
}

export const defaultAIConfig: AIConfig = {
  provider: "gemini",
  model: "gemini-2.5-flash-preview-03-25",
  maxTokens: 8192,
  temperature: 0.7,
  topP: 0.95,
  systemPrompt: "You are Khizar, an elite software engineering agent.",
  codeGeneration: {
    maxFilesPerRequest: 10,
    maxLinesPerFile: 500,
    includeExplanations: true,
    autoApply: false,
  },
  security: {
    requireApproval: true,
    maxRetries: 3,
    timeout: 30000,
  },
};
