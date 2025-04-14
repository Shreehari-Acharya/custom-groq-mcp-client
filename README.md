# Universal MCP Client with Groq's AI Inference

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Groq](https://img.shields.io/badge/Groq-API-orange)
![MCP](https://img.shields.io/badge/MCP-Protocol-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---
![groq Image](https://groq.com/wp-content/uploads/2024/03/GroqLogo_White.svg)
---

Welcome to the **Universal MCP Client with Groq AI**, a versatile command-line interface (CLI) that connects to any Model Context Protocol (MCP) server and harnesses Groq’s fast AI inference to execute tasks. Whether you’re querying databases, managing files, or interacting with APIs, this client lets you use natural language to control MCP tools across servers like Neon, Filesystem, GitHub, and more. Built with TypeScript and designed for flexibility, it’s your gateway to AI-driven automation! 

## Features

- **Universal MCP Support**: Connects to any MCP server via stdio (e.g., `npx`, local scripts)
- **AI-Powered Interaction**: Uses Groq’s [model](https://console.groq.com/docs/models) to translate natural language queries into tool calls.
- **Seamless CLI**: Interactive terminal experience with `readline/promises` for smooth user input.
- **Dynamic Tool Integration**: Discovers and maps MCP server tools (e.g., `list_projects`, `run_sql`, `create_repo`) to Groq’s API.
- **Robust Error Handling**: Gracefully manages API errors, tool mismatches, and connection issues.
- **TypeScript Excellence**: Fully typed for reliability and easy maintenance.

## What I’ve Created

This project is a **general-purpose MCP client** that empowers developers to:
- Connect to **any MCP server** supporting the MCP protocol locally (via stdio)
- Use **natural language queries** (e.g., “list my projects,” “run a SQL query”) to invoke server tools, powered by Groq’s AI Inference.
- Interact through a **CLI** that lists available tools, processes queries, and displays results.
- Support **multiple use cases**, such as:
  - Managing databases (e.g., Neon’s `list_projects`, `run_sql`).
  - File operations (e.g., Filesystem server’s `read_file`).
  - API interactions (e.g., GitHub server’s `create_repo`).
- Exit cleanly with `quit`, ensuring proper cleanup of connections.

It’s ideal for developers exploring MCP ecosystems, testing AI-driven workflows, or building custom integrations with servers like Neon, GitHub, or your own MCP implementations.

## Prerequisites

To get started, you’ll need:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (included with Node.js)
- A **Groq API Key** ([Get one here](https://console.groq.com/))
- Access to an **MCP server** (e.g., Neon, Filesystem, or a custom server)
- A terminal (e.g., Bash, PowerShell, VS Code’s integrated terminal)

Optional for specific servers:
- `npx` and `mcp-remote` for servers like Neon (`npm install -g mcp-remote`).
- Python or Node.js for local MCP scripts.

## Local Installation

Follow these steps to set up the Universal MCP Client locally:

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:Shreehari-Acharya/custom-groq-mcp-client.git
   cd custom-groq-mcp-client
   ```

2. **Install Dependencies**:
   Install required packages with:
   ```bash
   npm install
   ```
   This sets up:
   - `groq-sdk`: For AI query processing.
   - `@modelcontextprotocol/sdk`: For MCP client functionality.
   - `dotenv`: For environment variables.
   - `readline/promises`: For the CLI interface.
   - TypeScript dependencies for compilation.

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   Add your Groq API key:
   ```
   GROQ_API_KEY=your-groq-api-key
   ```
   Replace `your-groq-api-key` with your key from Groq’s console.

4. **link an MCP Server** 
   ```ts
   async connectToServer() {
    try {

      this.transport = new StdioClientTransport({
        command: 'CHANGE_THIS',            // For Example: command: 'npx',
        args: ['CHANGE', 'THIS']           // For Example: args: ["-y", "mcp-remote", "https://mcp.neon.tech/sse"],
      });
      this.mcp.connect(this.transport);
    // Rest of the code...
    ```

## Building 

1. **Run the build script**:
   ```bash
   npm run build
   ```
2. **Run the main file and you are good to go!**
   ```bash
   node build/index.js
   ```

### Example Usage
```
Query: show my repositories
Tool name: list_repos
Tool args: { "owner": "user" }
[Calling tool list_repos with args {"owner":"user"}]
Repositories: repo1, repo2
```

Try queries like:
- `list my files` (Filesystem server)
- `list all of my db` (Neon server)
- `fetch my issues` (GitHub server)


## Extending the Client

Take it further with these ideas:
- **Multi-Server Support**: Connect to multiple servers simultaneously (like Claude Desktop).
- **Config File**: Load server details from `mcp.json` for flexibility.
- **GUI Option**: Build a web or Electron interface instead of CLI.
- **Custom Tools**: Create your own MCP server for unique tasks.
- **Validation**: Add schema validation for tool arguments to catch errors early.


## Acknowledgments

- **Groq**: For their lightning-fast AI Inference.
- **MCP Protocol**: For enabling flexible server interactions.
- You, for checking out this project! 

### Feel free to fork or even contribute! :)