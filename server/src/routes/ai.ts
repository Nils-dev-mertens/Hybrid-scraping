import express, { RequestHandler } from "express";
import fs from "fs";
import { generateRandomString } from "../utils/string";
import { Aimodel, Extension, ExtensionInput } from "../data/types";


const app = express();
app.post("/upload", (req, res) => {
    const thought: boolean | undefined = typeof req.body.thought === 'boolean' ? req.body.thought : undefined;
    const fast: boolean | undefined = typeof req.body.fast === 'boolean' ? req.body.fast : undefined;
});