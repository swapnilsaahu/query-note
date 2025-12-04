import express, { Application, Request, Response } from 'express';
import cors from "cors";

const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());

import usersRouter from "./routes/users-router.ts"
app.use("/api/v1/users", usersRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`server is listening at http://localhost:${port}`);
});
