// khizar/packages/core/src/executor/interfaces.ts

export interface ExecOptions {
  cwd?: string;
  timeoutMs?: number;
  env?: Record<string, string>;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface CodeExecResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  feedback?: string;
}

export interface IExecutionDriver {
  executeCommand(command: string, options?: ExecOptions): Promise<ExecResult>;
  executeCode(code: string, language: string): Promise<CodeExecResult>;
  validateCode(code: string, language: string): Promise<ValidationResult>;
}
