// khizar/packages/core/src/fs/interfaces.ts

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  updatedAt?: number;
}

export interface IFileSystemDriver {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  listDirectory(path: string): Promise<FileEntry[]>;
  createDirectory(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  resolvePath(path: string): string; // Security: ensures path is fully resolved and within workspace root
}
