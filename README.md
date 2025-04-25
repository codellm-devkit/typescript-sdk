# Codellm-Devkit TypeScript SDK

## 🚀 Overview
Codellm-Devkit (CLDK) is a multilingual program analysis framework that bridges the gap between traditional static analysis tools and Large Language Models (LLMs) specialized for code (CodeLLMs). Codellm-Devkit allows developers to streamline the process of transforming raw code into actionable insights by providing a unified interface for integrating outputs from various analysis tools and preparing them for effective use by CodeLLMs.

## 📦 Installation

To install the Codellm-Devkit TypeScript SDK, you can use npm or yarn. Run the following command in your terminal:
   
### Using npm
```bash
npm install --save github:codellm-devkit/typescript-sdk#initial-sdk
```

### Using yarn
```bash
yarn add github:codellm-devkit/typescript-sdk#initial-sdk
```
If you are on yarn v1
```bash
yarn add codellm-devkit/typescript-sdk#initial-sdk
```

### Using bun 
```bash
bun add github:codellm-devkit/typescript-sdk#initial-sdk
```

Then run `npm install`, `yarn install`, or `bun install` depending on your package manager.

## ⚙️ Basic Usage

Here’s how to use CLDK to analyze a Java project and access key analysis artifacts:

```typescript
import { CLDK } from "typescript-sdk";
import { dayTraderApp } from "./path/to/config"; // Your app path setup

// Initialize Java analysis
const analysis = CLDK.for("java").analysis({
    projectPath: dayTraderApp,
    analysisLevel: "Symbol Table",
});

// Retrieve structured application model
const jApplication = await analysis.getApplication();
console.log("Parsed JApplication:", jApplication);

// Retrieve the symbol table
const symbolTable = await analysis.getSymbolTable();
console.log("Symbol Table:", symbolTable);
```
