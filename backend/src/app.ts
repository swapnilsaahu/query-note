import express, { Application, Request, Response } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

import usersRouter from "./routes/users-router.ts"
app.use("/api/v1/users", usersRouter);

import llmRouter from "./routes/llm-router.ts"
app.use("/api/v1/llm", llmRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`server is listening at http://localhost:${port}`);
});
