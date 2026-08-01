// khizar/packages/core/src/executor/driver.ts
import type { IExecutionDriver, ExecOptions, ExecResult, CodeExecResult, ValidationResult } from "./interfaces";

export class LocalExecutorDriver implements IExecutionDriver {
  async executeCommand(command: string, options?: ExecOptions): Promise<ExecResult> {
    // Safeguard direct local run in web
    if (command.includes("rm -rf") || command.includes(":(){ :|:& };:")) {
      throw new Error("Malicious shell sequence rejected by executor guard.");
    }
    const proc = Bun.spawn(["sh", "-c", command], { stdout: "pipe", stderr: "pipe" });
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    await proc.exited;
    return { stdout, stderr, exitCode: proc.exitCode ?? 0 };
  }

  async executeCode(code: string, language: string): Promise<CodeExecResult> {
    return { success: true, output: "Code compilation mock output." };
  }

  async validateCode(code: string, language: string): Promise<ValidationResult> {
    return { valid: true };
  }
}
