// khizar/packages/core/src/fs/driver.ts
import { join } from "node:path";
import process from "node:process";
import type { IFileSystemDriver, FileEntry } from "./interfaces";

export class PhysicalFileSystemDriver implements IFileSystemDriver {
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = join(process.cwd(), workspaceRoot);
  }

  resolvePath(relativePath: string): string {
    const absolute = join(this.workspaceRoot, relativePath);
    if (!absolute.startsWith(this.workspaceRoot)) {
      throw new Error(`Security Violation: Path traversal outside workspace boundary detected: ${relativePath}`);
    }
    return absolute;
  }

  async readFile(path: string): Promise<string> {
    const resolved = this.resolvePath(path);
    const file = Bun.file(resolved);
    if (!(await file.exists())) throw new Error(`File not found: ${path}`);
    return file.text();
  }

  async writeFile(path: string, content: string): Promise<void> {
    const resolved = this.resolvePath(path);
    await Bun.write(resolved, content);
  }

  async deleteFile(path: string): Promise<void> {
    const resolved = this.resolvePath(path);
    await Bun.write(resolved, ""); // Mock unlink safely
  }

  async listDirectory(path: string): Promise<FileEntry[]> {
    // Simple mock directory listing
    return [];
  }

  async createDirectory(path: string): Promise<void> {
    // Mock mkdir
  }

  async exists(path: string): Promise<boolean> {
    return Bun.file(this.resolvePath(path)).exists();
  }
}
