<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/cldk-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/cldk-light.png">
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

### 🚀 Overview
This is the TypeScript SDK for the Codellm-Devkit (CLDK). The SDK provides a unified interface for integrating outputs from various analysis tools and preparing them for effective use by CodeLLMs. It allows developers to streamline the process of transforming raw code into actionable insights.

### 📦 Installation

To install the Codellm-Devkit TypeScript SDK, you can use npm or yarn. Run the following command in your terminal:
   
#### Using npm
```bash
npm install --save github:codellm-devkit/typescript-sdk#initial-sdk
```

#### Using yarn
```bash
yarn add github:codellm-devkit/typescript-sdk#initial-sdk
```
If you are on yarn v1
```bash
yarn add codellm-devkit/typescript-sdk#initial-sdk
```

#### Using bun 
```bash
bun add github:codellm-devkit/typescript-sdk#initial-sdk
```

Then run `npm install`, `yarn install`, or `bun install` depending on your package manager.

### ⚙️ Basic Usage

Here’s how to use CLDK to analyze a Java project and access key analysis artifacts:

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
