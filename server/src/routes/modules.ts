import express, { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import { generateRandomString } from "../utils/string";
import { Aimodel, Extension, ExtensionInput } from "../data/types";
import { getAiModelByname } from "../data/database";

const app = express();

// Configure multer for disk storage with renaming
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // ensure folder exists
    filename: (req, file, cb) => {
        const newName = `l${generateRandomString(20)}`;
        cb(null, newName);
    },
});

const upload = multer({ storage });

const uploadHandler: RequestHandler = async (req, res) => {const companyname: string | undefined = typeof req.body.companyname === 'string' ? req.body.companyname : undefined;
    const aiModel: string | undefined = typeof req.body.aiModel === 'string' ? req.body.aiModel : undefined;
    const thought: boolean | undefined = typeof req.body.thought === 'boolean' ? req.body.thought : undefined;
    const fast: boolean | undefined = typeof req.body.fast === 'boolean' ? req.body.fast : undefined;
    const provider = req.body.provider && typeof req.body.provider === 'object' && typeof req.body.provider.Id === 'number' && typeof req.body.provider.Name === 'string'
        ? { Id: req.body.provider.Id, Name: req.body.provider.Name }
        : undefined;
    const aiGenerated: boolean | undefined = typeof req.body.aiGenerated === 'boolean' ? req.body.aiGenerated : undefined;
    const elementSelectors: string[] | undefined = Array.isArray(req.body.elementSelectors) ? req.body.elementSelectors : undefined;
    const allowedReturnTypes = ["Nothing", "string", "file"];
    const allowedInputTypes = ["Nothing", "pdf", "link", "html"];
    const returnType: "Nothing" | "string" | "file" = allowedReturnTypes.includes(req.body.returnType) ? req.body.returnType : "Nothing";
    const inputType: "Nothing" | "pdf" | "link" | "html" = allowedInputTypes.includes(req.body.inputType) ? req.body.inputType : "Nothing";

    if (companyname === undefined || 
        aiModel === undefined || 
        aiGenerated === undefined || 
        elementSelectors === undefined) {
        res.json({
            message: "File uploaded successfully",
        });
        return;
    }

    let aiModelValue: "Human_made" | Aimodel;
    if (aiModel === "Human_made") {
        aiModelValue = "Human_made";
    } else if (aiModel && thought !== undefined && fast !== undefined && provider) {
        aiModelValue = {
            name: aiModel,
            thought,
            fast,
            Provider: provider
        };
    } else {
        aiModelValue = "Human_made";
    }

    const aimodelname = await getAiModelByname(aiModel);
    if(aimodelname == undefined){
        res.json({
            message: "File uploaded successfully",
        });
        return;
    }

    const temp: ExtensionInput = {
        Extensionstring: generateRandomString(24),
        CompanyName: companyname,
        AiModel: aimodelname[0],
        Ai_generated: aiGenerated !== undefined ? aiGenerated : false,
        ElementSelectors: elementSelectors || [],
        ReturnType: returnType,
        InputType: inputType
    };
    
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return; // return void, satisfies RequestHandler
    }

    // Read file content (only for small/medium files)
    const content = fs.readFileSync(file.path, "utf-8");

    res.json({
        message: "File uploaded successfully",
        newName: file.filename,
        preview: content.slice(0, 100), // just first 100 chars
    });
};

// Apply multer middleware + your handler
app.post("/upload", upload.single("file"), uploadHandler);

app.listen(3000, () => console.log("Server running on port 3000"));
