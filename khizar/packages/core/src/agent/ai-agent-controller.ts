// khizar/packages/core/src/agent/ai-agent-controller.ts
import type { IModelProvider } from "@khizar/llms";
import type { IFileSystemDriver } from "../fs/interfaces";
import type { IExecutionDriver } from "../executor/interfaces";
import { CodeGenerator } from "../code-generation/code-generator";

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class AIAgentController {
  constructor(
    private readonly modelProvider: IModelProvider,
    private readonly codeGenerator: CodeGenerator,
    private readonly fileSystem: IFileSystemDriver,
    private readonly executionDriver: IExecutionDriver
  ) {}

  async processRequest(request: { prompt: string; context?: any }): Promise<AgentResponse> {
    try {
      const response = await this.modelProvider.generate({
        messages: [{ role: "user", content: request.prompt }]
      });
      return {
        success: true,
        message: response.text,
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async generateCode(description: string, context?: any): Promise<any> {
    const prompt = this.codeGenerator.generatePromptForNewCode(
      description,
      context?.language || "typescript",
      context?.projectPath || "workspace"
    );
    const response = await this.modelProvider.generate({
      messages: [{ role: "user", content: prompt }]
    });
    const parsedCode = this.codeGenerator.parseCodeBlock(response.text);
    return {
      code: parsedCode,
      filePath: context?.filePath || "workspace/output.ts",
      explanation: "Autonomous compilation succeeded.",
    };
  }

  async editCode(filePath: string, instructions: string): Promise<any> {
    const exists = await this.fileSystem.exists(filePath);
    const currentContent = exists ? await this.fileSystem.readFile(filePath) : "";
    const prompt = this.codeGenerator.generatePromptForEdit(
      filePath,
      instructions,
      currentContent,
      "typescript",
      "workspace"
    );
    const response = await this.modelProvider.generate({
      messages: [{ role: "user", content: prompt }]
    });
    const updatedContent = this.codeGenerator.parseCodeBlock(response.text);
    await this.fileSystem.writeFile(filePath, updatedContent);
    return {
      success: true,
      filePath,
      updatedContent,
    };
  }

  async fixBugs(filePath: string, errorDescription?: string): Promise<any> {
    const currentContent = await this.fileSystem.readFile(filePath);
    const prompt = this.codeGenerator.generatePromptForBugFix(
      filePath,
      errorDescription || "Unknown syntax error.",
      currentContent,
      "typescript",
      "workspace"
    );
    const response = await this.modelProvider.generate({
      messages: [{ role: "user", content: prompt }]
    });
    const fixedCode = this.codeGenerator.parseCodeBlock(response.text);
    await this.fileSystem.writeFile(filePath, fixedCode);
    return {
      success: true,
      filePath,
      fixedCode,
    };
  }

  async generateTests(filePath: string): Promise<any> {
    const code = await this.fileSystem.readFile(filePath);
    const response = await this.modelProvider.generate({
      messages: [{ role: "user", content: `Write test cases for:\n${code}` }]
    });
    return {
      success: true,
      tests: this.codeGenerator.parseCodeBlock(response.text)
    };
  }

  async explainCode(filePath: string): Promise<any> {
    const code = await this.fileSystem.readFile(filePath);
    const response = await this.modelProvider.generate({
      messages: [{ role: "user", content: `Explain the following code snippet:\n${code}` }]
    });
    return {
      explanation: response.text
    };
  }
}
export default AIAgentController;
