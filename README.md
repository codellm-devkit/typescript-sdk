<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/cldk-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./docs/assets/cldk-light.png">
  <img alt="Logo">
</picture>

<p align='center'>
  <a href="https://arxiv.org/abs/2410.13007">
    <img src="https://img.shields.io/badge/arXiv-2410.13007-b31b1b?style=for-the-badge" />
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge" />
  </a>
  <a href="https://codellm-devkit.info">
    <img src="https://img.shields.io/badge/GitHub%20Pages-Docs-blue?style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.com/package/@cldk/cldk">
    <img src="https://img.shields.io/npm/v/@cldk/cldk?color=crimson&logo=npm&style=for-the-badge" />
  </a>
  <a href="https://discord.com/channels/1333486179667935403/1334150434348208208">
    <img src="https://dcbadge.limes.pink/api/server/https://discord.gg/zEjz9YrmqN?style=for-the-badge"/>
  </a>
</p>


**A framework that bridges the gap between traditional program analysis tools and Large Language Models (LLMs) specialized for code (CodeLLMs).**

### Overview
This is the TypeScript SDK for the Codellm-Devkit (CLDK). The SDK provides a unified interface for integrating outputs from various analysis tools and preparing them for effective use by CodeLLMs. It allows developers to streamline the process of transforming raw code into actionable insights.

### 📦 Installation

   To install the SDK, you can use bun, npm, or yarn. Run the following command in your terminal:
   
1. Using npm
   ```bash
   npm i @cldk/cldk
   ```

2. Using yarn
   ```bash
   yarn add @cldk/cldk
   ```

3. Using bun 
   ```bash
   bun add @cldk/cldk
   ```

### 🚀 Quickstart

1. Create a Temporary Directory

   ```bash
   mkdir cldk-quickstart
   cd cldk-quickstart
   ```

2. Initialize a Bare Project

   ```bash
   bun init -y
   ```

   This creates a minimal `package.json` instantly.

3. Install `@cldk/cldk`
   
   ```bash
   bun add @cldk/cldk
   ```

4. Create a file `test-analysis.ts` with the following content:

   ```typescript
   import { CLDK } from "cldk";
   
   // Initialize Java analysis
   const analysis = CLDK.for("java").analysis({
       projectPath: "/path/to/your/java/project",
       analysisLevel: "Symbol Table",
   });
   
   // Retrieve structured application model
   const jApplication = await analysis.getApplication();
   console.log("Parsed JApplication:", jApplication);
   
   // Retrieve the symbol table
   const symbolTable = await analysis.getSymbolTable();
   console.log("Symbol Table:", symbolTable);
   ```

5. Run the Script

   ```bash
   bun test-analysis.ts
   ```

### 🛠️ Development Instructions

#### Developing Locally (with Bun)

1. Clone the repository:
   ```bash
   git clone https://github.com/codellm-devkit/typescript-sdk.git
   cd typescript-sdk
   ```

2. If you don't have it already, pleaes install `Bun`:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
   _Note: follow any post-installation instructions to complete the installation_
3. Install the dependencies
   ```bash
   bun install
   ```

4. Run tests:
   ```bash
   bun run test
   ```

#### Developing inside a Container (Using Dev Containers)

1. If you don't, ensure you have Docker/Podman and a compatible editor (e.g., VS Code) with the Dev Containers extension installed.

2. Open the repository in your editor. When prompted, reopen the project in the dev container. The devcontainer is configured to come pre-installed with bun and all the necessary dependencies.
 
3. You can start by run tests:
   ```bash
   bun run test
   ```