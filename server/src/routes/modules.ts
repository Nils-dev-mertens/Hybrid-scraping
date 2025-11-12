import express, { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import ts from "typescript";
import path from "path";
import { generateRandomString } from "../utils/string";
import { AiModel, Extension } from "../data/types";
import { executeModule } from "../modules/compute/compute";
import { addExtension, getAllExtensions } from "../data/database";

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

const storageReplace = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storageDir),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
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
  // Prepare extension data from request body (fall back to sensible defaults)
  const company_id = parseInt((req.body.company_id ?? req.body.companyId) as string) || 0;
  const ai_model_id_raw = req.body.ai_model_id ?? req.body.aiModelId ?? null;
  const ai_model_id = ai_model_id_raw !== null && ai_model_id_raw !== undefined ? parseInt(String(ai_model_id_raw)) : null;
  const action_name = (req.body.action_name ?? req.body.actionName ?? file.originalname) as string;
  const ai_generated = (req.body.ai_generated ?? req.body.aiGenerated ?? false) === true || String(req.body.ai_generated ?? req.body.aiGenerated) === 'true';
  const verified = (req.body.verified ?? false) === true || String(req.body.verified ?? false) === 'true';
  const last_edited = req.body.last_edited ? new Date(String(req.body.last_edited)) : new Date();
  const input_type_id = parseInt((req.body.input_type_id ?? req.body.inputTypeId) as string) || 1;
  const return_type_id = parseInt((req.body.return_type_id ?? req.body.returnTypeId) as string) || 1;

  try {
    const filename = path.basename(jsFilePath!).split(".")[0];
    const insertedId = await addExtension({
      ai_model_id: ai_model_id as any,
      filename: path.basename(jsFilePath!).split(".")[0],
      action_name,
      ai_generated,
      verified,
      last_edited,
      input_type_id,
      return_type_id,
    });

    if(company_id != 0){
      console.log(company_id + " companyid has now " + insertedId)
    }

    res.json({
      message: "File uploaded successfully",
      filename
    });
  } catch (error) {
    console.error('Error inserting extension:', error);
    res.status(500).json({ error: 'Failed to save extension to database' });
  }
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

    // Prepare extension data from request body (fall back to sensible defaults)
  const company_id = parseInt((req.body.company_id ?? req.body.companyId) as string) || 0;
  const ai_model_id_raw = req.body.ai_model_id ?? req.body.aiModelId ?? null;
  const ai_model_id = ai_model_id_raw !== null && ai_model_id_raw !== undefined ? parseInt(String(ai_model_id_raw)) : null;
  const action_name = (req.body.action_name ?? req.body.actionName ?? baseName) as string;
  const ai_generated = (req.body.ai_generated ?? req.body.aiGenerated ?? false) === true || String(req.body.ai_generated ?? req.body.aiGenerated) === 'true';
  const verified = (req.body.verified ?? false) === true || String(req.body.verified ?? false) === 'true';
  const last_edited = req.body.last_edited ? new Date(String(req.body.last_edited)) : new Date();
  const input_type_id = parseInt((req.body.input_type_id ?? req.body.inputTypeId) as string) || 1;
  const return_type_id = parseInt((req.body.return_type_id ?? req.body.returnTypeId) as string) || 1;

    try {
    const filename = path.basename(jsFilePath!).split(".")[0];
    const insertedId = await addExtension({
      ai_model_id: ai_model_id as any,
      filename: path.basename(jsFilePath!).split(".")[0],
      action_name,
      ai_generated,
      verified,
      last_edited,
      input_type_id,
      return_type_id,
    });

    if(company_id != 0){
      console.log(company_id + " companyid has now " + insertedId)
    }

    res.json({
      message: "File uploaded successfully",
      filename
    });
  } catch (error) {
    console.error('Error inserting extension:', error);
    res.status(500).json({ error: 'Failed to save extension to database' });
  }
};

//opload new module 
app.post("/upload/file", upload.single("file"), uploadHandlerFile);

app.post("/upload/code", uploadHandlerCode);

app.get("/", async (req, res) => {
  res.send(await getAllExtensions())
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

app.put("/execute/:id", async (req, res) => {
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
