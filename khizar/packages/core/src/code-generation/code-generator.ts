// khizar/packages/core/src/code-generation/code-generator.ts
import { CodeGenerationPrompts } from "@khizar/shared";

export interface GeneratedCode {
  code: string;
  filePath: string;
  explanation?: string;
}

export interface EditResult {
  success: boolean;
  filePath: string;
  updatedContent: string;
}

export interface FixResult {
  success: boolean;
  filePath: string;
  fixedCode: string;
}

export interface TestGenerationResult {
  success: boolean;
  tests: string;
}

export interface CodeExplanation {
  explanation: string;
}

export class CodeGenerator {
  /**
   * Helper to parse markdown codeblocks out of LLM response text
   */
  parseCodeBlock(responseText: string): string {
    const match = responseText.match(/```[\w]*\n([\s\S]*?)\n```/);
    return match ? match[1] : responseText;
  }

  generatePromptForNewCode(description: string, language: string, projectPath: string): string {
    return CodeGenerationPrompts.getCodeGenerationPrompt({
      description,
      context: { language, projectPath }
    });
  }

  generatePromptForEdit(filePath: string, instructions: string, currentContent: string, language: string, projectPath: string): string {
    return CodeGenerationPrompts.getCodeEditPrompt({
      filePath,
      instructions,
      currentContent,
      context: { language, projectPath }
    });
  }

  generatePromptForBugFix(filePath: string, errorDescription: string, currentContent: string, language: string, projectPath: string): string {
    return CodeGenerationPrompts.getBugFixPrompt({
      filePath,
      errorDescription,
      currentContent,
      backgroundContext: undefined, // Type compatible
      context: { language, projectPath }
    } as any);
  }
}
