// khizar/packages/core/src/database/interfaces.ts

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

export interface UserInput {
  email: string;
  passwordHash: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  workspacePath: string;
  createdAt: number;
}

export interface ProjectInput {
  userId: string;
  name: string;
  workspacePath: string;
}

export interface Session {
  id: string;
  projectId: string;
  title: string;
  providerId: string;
  modelId: string;
  status: "idle" | "running" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
}

export interface SessionInput {
  projectId: string;
  title: string;
  providerId: string;
  modelId: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "meta" | "error";
  contentJson: string; // JSON string representing message blocks
  metricsJson?: string; // JSON string for tokens, cost, runtime
  createdAt: number;
}

export interface MessageInput {
  sessionId: string;
  role: "user" | "assistant" | "meta" | "error";
  contentJson: string;
  metricsJson?: string;
}

export interface UserSettings {
  userId: string;
  theme: "dark" | "light";
  maxIterations: number;
  autoApproveTools: boolean;
}

export interface UsageRecord {
  userId: string;
  sessionId: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: number;
}

export interface UsageStats {
  userId: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
}

export type Timeframe = "day" | "week" | "month" | "all";

export interface IDatabaseAdapter {
  // Users
  createUser(user: UserInput): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Projects
  createProject(project: ProjectInput): Promise<Project>;
  getProject(id: string): Promise<Project | null>;
  listProjects(userId: string): Promise<Project[]>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Sessions
  createSession(session: SessionInput): Promise<Session>;
  getSession(id: string): Promise<Session | null>;
  listSessions(projectId: string): Promise<Session[]>;
  updateSession(id: string, data: Partial<Session>): Promise<Session>;
  deleteSession(id: string): Promise<void>;

  // Messages
  createMessage(message: MessageInput): Promise<Message>;
  getMessages(sessionId: string): Promise<Message[]>;

  // Settings
  getSettings(userId: string): Promise<UserSettings>;
  updateSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings>;

  // API Keys (encrypted)
  saveAPIKey(userId: string, provider: string, key: string): Promise<void>;
  getAPIKey(userId: string, provider: string): Promise<string | null>;
  deleteAPIKey(userId: string, provider: string): Promise<void>;

  // Usage Tracking
  recordUsage(usage: UsageRecord): Promise<void>;
  getUsageStats(userId: string, timeframe?: Timeframe): Promise<UsageStats>;
}
