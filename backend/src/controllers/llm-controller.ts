import { Request, Response } from "express";
import { llmRequestWithPrompt, serachQuery } from "../services/chatbot-service";

export const userQueryController = async (req: Request, res: Response) => {
    try {
        const { userQuery } = req.body;
        const responseFromLLM = await llmRequestWithPrompt(userQuery);
        if (!responseFromLLM) throw new Error('error while generating response');

        return res.status(200).json({
            responseText: responseFromLLM
        })
    } catch (err) {
        console.error("server err", err);
        res.status(500).json({
            msg: "server err"
        })
    }
}
