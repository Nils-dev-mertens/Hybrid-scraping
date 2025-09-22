import express, { Express }  from "express";
import companies from "../routes/companies";
import extensions from "../routes/modules";
import { setUpDB } from "../data/database";

const app: Express = express();

app.use("/companies", companies);
app.use("/extensions", extensions);

app.get("/", (req, res) => {
    res.send({status : 200});
});

app.listen(3000, async () => {
    await setUpDB();
    console.log(`Server started on http://localhost:${3000}`);
});