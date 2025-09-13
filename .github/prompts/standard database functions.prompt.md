---
description: "Create reusable TypeScript functions to interact with a SQL database"
mode: "agent"
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'extensions', 'todos', 'editFiles', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks']
---

Your goal is to create **reusable TypeScript functions** for inserting, deleting, and retrieving data from a SQL database, using the provided `.sql` and `types.ts` files.  

Requirements:
1. Use the **existing TypeScript types** for function parameters and return values.  
2. Do **not modify** the `.sql` schema files.  
3. Do **not modify** the `types.ts` definitions.  
4. Functions should be **self-explanatory**, doing exactly what their name implies.  
5. Functions should be **generic and reusable**, minimizing edge-case handling inside them.  
6. Ensure proper type-safety and conversions (e.g., JSON columns to arrays, ENUMs to union types).  
7. Organize functions in a way they can be **imported and reused across the project**.  
8. Focus on **clarity, maintainability, and adherence to the database schema**.

