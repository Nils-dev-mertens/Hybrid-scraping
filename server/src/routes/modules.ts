import express, { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import { generateRandomString } from "../utils/string";
import { AiModel, Extension } from "../data/types";

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

app.get("/", (req, res) => {
    res.send({status : 200, path : "extensions"})
});

export default app;
