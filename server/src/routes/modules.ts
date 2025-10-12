import express, { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import ts from "typescript";
import path from "path";
import { generateRandomString } from "../utils/string";
import { AiModel, Extension } from "../data/types";
import { executeModule } from "../modules/compute/compute";

const app = express();

// Configure multer to store files in server/src/modules/storage with random names
const storageDir = path.join(__dirname, "..", "modules", "storage");
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const newName = `l${generateRandomString(20)}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

function compileAndReplace(filePath: string): string {
  const source = fs.readFileSync(filePath, "utf8");

  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });

  // Replace .ts with .js
  const jsPath = filePath.replace(/\.ts$/, ".js");
  fs.writeFileSync(jsPath, result.outputText);

  // Delete the original .ts
  fs.unlinkSync(filePath);

  return jsPath;
}

const uploadHandlerFile: RequestHandler = async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  let jsFilePath: string | null = null;

  // Convert to JS if TypeScript
  if (file.originalname.endsWith(".ts")) {
    jsFilePath = compileAndReplace(file.path);
    console.log(`Compiled ${file.originalname} -> ${path.basename(jsFilePath)}`);
  }

  res.json({
    message: "File uploaded successfully",
    original: file.filename,
    compiled: jsFilePath ? path.basename(jsFilePath) : null,
  });
};

export const uploadHandlerCode: RequestHandler = async (req, res) => {
  const { code } = req.body;

  if (typeof code !== "string" || !code.trim()) {
    res.status(400).json({ error: "Missing or invalid 'code' field" });
    return;
  }

  const baseName:string = generateRandomString(20);

  const tsPath = path.join(storageDir, `${baseName}.ts`);
  fs.writeFileSync(tsPath, code, "utf8");

  const jsFilePath = compileAndReplace(tsPath);

  console.log(`Compiled string input -> ${path.basename(jsFilePath)}`);

  res.json({
    message: "Code compiled successfully",
    compiled: path.basename(jsFilePath),
  });
};

//opload new module 
app.post("/upload/file", upload.single("file"), uploadHandlerFile);

app.post("/upload/code", uploadHandlerCode);

app.get("/", (req, res) => {
  res.send({ status: 200, path: "extensions" })
});

app.post("/execute/:id", async (req, res) => {
  try { 
    const id = req.params.id;
    const inputvalue = req.body.value ?? undefined;
    const success = await executeModule(id, inputvalue); // wait until worker finishes
    console.log(success);
    res.json({response : { success }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Execution failed" });
  }
});

export default app;
