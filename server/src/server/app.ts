import express, { Express }  from "express";
import companies from "../routes/companies";

const app: Express = express();

app.use("/companies", companies);

app.get("/", (req, res) => {
    res.send({status : 200});
});

app.listen(3000, () => {
    console.log(`Server started on http://localhost:${3000}`);
});