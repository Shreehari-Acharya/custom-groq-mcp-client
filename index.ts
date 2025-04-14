import Groq from "groq-sdk";
import { ChatCompletionTool } from "groq-sdk/src/resources/chat.js";
import { ChatCompletionUserMessageParam } from "groq-sdk/resources/chat.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
import readline from 'readline/promises';


// CONSTANTS
const MODEL = "llama-3.3-70b-versatile" // Change this to the model you want to use

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY; // Make sure you have an API key set in your .env file
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set");
}

class MCPClient {
  private mcp: Client;
  private groq: Groq;
  private transport: StdioClientTransport | null = null;
  private tools: ChatCompletionTool[] = [];

  constructor() {
    this.groq = new Groq({
      apiKey: GROQ_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  async connectToServer() {
    try {

      this.transport = new StdioClientTransport({
        command: 'CHANGE_THIS',            // For Example: command: 'npx',
        args: ['CHANGE', 'THIS']           // For Example: args: ["-y", "mcp-remote", "https://mcp.neon.tech/sse"],
      });
      this.mcp.connect(this.transport);
      
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          function:{
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
          type: "function",
        };
      });
      console.log(
        "Connected to server with tools:",
        this.tools.map(({ function: { name } }) => name)
      );
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    const messages: ChatCompletionUserMessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];
  
    try {
      const response = await this.groq.chat.completions.create({
        model: MODEL,
        max_tokens: 1000,
        messages,
        tools: this.tools,
      });
    
      const finalText = [];
      const toolResults = [];
    
      for (const content of response.choices) {
        if (content.finish_reason === "stop" || content.finish_reason === "length") {
          finalText.push(content.message.content);
        } else if (content.finish_reason === "tool_calls") {
          const toolName = content.message.tool_calls?.[0].function.name as string;
          const toolArgs = content.message.tool_calls?.[0].function.arguments
          
          const jsonToolArgs = JSON.parse(toolArgs as string);

          const result = await this.mcp.callTool({
            name: toolName,
            arguments: jsonToolArgs as { [x: string]: unknown } | undefined 
          });
          toolResults.push(result);
          finalText.push(
            `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
          );
    
          messages.push({
            role: "user",
            content: result.content as string,
          });
    
          const response = await this.groq.chat.completions.create({
            model: MODEL,
            max_tokens: 1000,
            messages,
          });
    
          finalText.push(
            response.choices[0].finish_reason === "length" || response.choices[0].finish_reason === "stop" ? response.choices[0].message.content : ""
          );
        }
        return finalText.join("\n");
      }
    } catch (error) {
      console.error("Error processing query:", error);
      return "Error processing query";
    }
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");
  
      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }
  
  async cleanup() {
    await this.mcp.close();
  }

} 

async function main() {

  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer();
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();