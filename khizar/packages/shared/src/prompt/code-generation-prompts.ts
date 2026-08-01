// khizar/packages/shared/src/prompt/code-generation-prompts.ts

export interface CodeContext {
  language: string;
  projectPath: string;
  existingCode?: string;
  relatedFiles?: string[];
  structure?: string;
}

export interface CodeRequest {
  description: string;
  context: CodeContext;
}

export interface EditRequest {
  filePath: string;
  instructions: string;
  currentContent: string;
  context: CodeContext;
}

export interface BugContext {
  filePath: string;
  errorDescription: string;
  currentContent: string;
  context: CodeContext;
}

export class CodeGenerationPrompts {
  static getSystemPrompt(context: CodeContext): string {
    return `You are Khizar, an elite autonomous AI software engineer.
Your goal is to write high-quality, production-ready, error-free code inside a sandboxed workspace environment.
Current Project Context:
- Workspace Path: ${context.projectPath}
- Primary Language: ${context.language}
- Project Structure: ${context.structure || "Standard Directory Tree"}

Always adhere to these guidelines:
1. Write clean, self-documented, highly testable code.
2. Ensure you handle edge cases and write safety input sanitization guards.
3. Organize file updates inside complete blocks, explaining the edits cleanly.
4. Output changes with clear formatting.`;
  }

  static getCodeGenerationPrompt(request: CodeRequest): string {
    return `Task: Generate new code based on the following instructions.
Description: ${request.description}
Language: ${request.context.language}
Workspace Target: ${request.context.projectPath}

Please output the code wrapped inside standard markdown codeblocks, specifying the file names, directories, and dependencies required.`;
  }

  static getCodeEditPrompt(editRequest: EditRequest): string {
    return `Task: Edit existing code file.
File Path: ${editRequest.filePath}
Instructions to apply: ${editRequest.instructions}

Current File Content:
\`\`\`${editRequest.context.language}
${editRequest.currentContent}
\`\`\`

Generate a precise, correct updated version of this file, preserving all original imports and logic unless specified.`;
  }

  static getBugFixPrompt(bugContext: BugContext): string {
    return `Task: Fix Bugs and errors in the following code.
File: ${bugContext.filePath}
Error/Issue Description: ${bugContext.errorDescription}

Current Code:
\`\`\`${bugContext.context.language}
${bugContext.currentContent}
\`\`\`

Identify the root cause of the bug, fix it, and output the clean corrected code alongside a concise explanation of the fix.`;
  }

  static getCodeReviewPrompt(code: string): string {
    return `Task: Perform a comprehensive Code Review.
Code to analyze:
\`\`\`
${code}
\`\`\`

Evaluate performance, structural complexity, potential security vulnerabilities, formatting issues, and suggest concrete optimization improvements.`;
  }

  static getTestGenerationPrompt(code: string): string {
    return `Task: Generate a robust test suite.
Target Code:
\`\`\`
${code}
\`\`\`

Write complete, syntactically correct unit/integration tests using standard frameworks (such as Jest, Vitest, PyTest, etc.) covering success conditions and failure edge cases.`;
  }
}
