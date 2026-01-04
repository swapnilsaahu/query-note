import { Request, Response } from "express";
import { llmRequestWithPrompt, serachQuery } from "../services/chatbot-service";

export const userQueryController = async (req: Request, res: Response) => {
    try {
        const { userQuery } = req.body;
        const responseFromLLM = await llmRequestWithPrompt(userQuery);
        if (!responseFromLLM) throw new Error('error while generating response');

        return res.status(200).json({
            id: responseFromLLM[2],
            query: userQuery,
            responseText: responseFromLLM[0],
            imgLink: responseFromLLM[1]
        })
    } catch (err) {
        console.error("server err", err);
        res.status(500).json({
            msg: "server err"
        })
    }
}
