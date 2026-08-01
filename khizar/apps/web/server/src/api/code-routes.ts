// khizar/apps/web/server/src/api/code-routes.ts
import { GeminiProvider } from "@khizar/llms";
import {
  CodeGenerator,
  AIAgentController,
  CodeContextProvider,
  PhysicalFileSystemDriver,
  LocalExecutorDriver
} from "@khizar/core";

// Initialize AI core instances
const geminiApiKey = process.env.GEMINI_API_KEY || "mock-api-key";
const geminiProvider = new GeminiProvider(geminiApiKey);
const codeGenerator = new CodeGenerator();
const fsDriver = new PhysicalFileSystemDriver("workspace");
const execDriver = new LocalExecutorDriver();
const controller = new AIAgentController(geminiProvider, codeGenerator, fsDriver, execDriver);
const contextProvider = new CodeContextProvider();

export async function handleCodeRoutes(req: Request, url: URL): Promise<Response | null> {
  const jsonHeaders = { "content-type": "application/json" };

  try {
    // 1. Generate code
    if (url.pathname === "/api/code/generate" && req.method === "POST") {
      const { prompt, context } = await req.json() as any;
      const code = await controller.generateCode(prompt, context);
      return new Response(JSON.stringify({ success: true, code }), { headers: jsonHeaders });
    }

    // 2. Edit code
    if (url.pathname === "/api/code/edit" && req.method === "POST") {
      const { filePath, instructions } = await req.json() as any;
      const result = await controller.editCode(filePath, instructions);
      return new Response(JSON.stringify({ success: true, result }), { headers: jsonHeaders });
    }

    // 3. Fix bugs
    if (url.pathname === "/api/code/fix" && req.method === "POST") {
      const { filePath, errorDescription } = await req.json() as any;
      const result = await controller.fixBugs(filePath, errorDescription);
      return new Response(JSON.stringify({ success: true, result }), { headers: jsonHeaders });
    }

    // 4. Generate tests
    if (url.pathname === "/api/code/tests" && req.method === "POST") {
      const { filePath } = await req.json() as any;
      const result = await controller.generateTests(filePath);
      return new Response(JSON.stringify({ success: true, tests: result.tests }), { headers: jsonHeaders });
    }

    // 5. Explain code
    if (url.pathname === "/api/code/explain" && req.method === "POST") {
      const { filePath } = await req.json() as any;
      const explanation = await controller.explainCode(filePath);
      return new Response(JSON.stringify({ success: true, explanation }), { headers: jsonHeaders });
    }

    // 6. Get code completions
    if (url.pathname === "/api/code/completions" && req.method === "POST") {
      const { filePath, position, context } = await req.json() as any;
      const completions = [
        { label: "is_prime(n)", insertText: "is_prime(${1:n})" },
        { label: "factorial(n)", insertText: "factorial(${1:n})" }
      ];
      return new Response(JSON.stringify({ completions }), { headers: jsonHeaders });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: jsonHeaders });
  }

  return null; // Route not matched
}
