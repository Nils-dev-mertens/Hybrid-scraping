import express from "express";
import { getAllCompanies } from "../data/database";
import { Company } from "../data/types";

const router = express.Router();

router.get("/", async (req, res) => {
    const ALLCOMPANIES:Company[] | undefined = await getAllCompanies();
    console.log(ALLCOMPANIES);
    res.send(ALLCOMPANIES);
});

export default router;