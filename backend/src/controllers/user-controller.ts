import { Request, Response } from "express";
import { createUser, findByEmail, insertEmbAndContent, insertRefreshToken, semanticSearch } from "../db/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { chunkingText, documentConversionText, main, responseType, textToVecEmb } from "../services/text-extraction-ocr";
import { unlink } from "fs/promises";
import { createAgent, SystemMessage } from "langchain";
import { initChatModel } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";



export interface userType {
    username: string,
    email: string,
    hashPassword: string
}

export interface refreshTokenType {
    token: string,
    deviceInfo: string,
    ipAddr: string,
    userId: string
}
const JWT_SECRET = "asdjhfouashtp0wehp9uohpodfhjsdhfuoas";

const generateTokens = (userID: string): { accessToken: string, refreshToken: string } => {
    const jwt_id = uuidv4();
    const accessTokenJWT = jwt.sign({
        userId: userID
    }, JWT_SECRET, {
        expiresIn: "15m"
    })
    const refreshTokenJWT = jwt.sign({
        userId: userID
    }, JWT_SECRET, {
        expiresIn: "30d",
        jwtid: jwt_id
    })
    return { accessToken: accessTokenJWT, refreshToken: refreshTokenJWT }
}
export const registerUser = async (req: Request, res: Response) => {
    try {
        //extract details about the user
        //check if user exists or not
        //if yes res that user already exists 
        //if no then create user in db with details and hash the password before
        //res with success
        const { username, email, password } = req.body;
        const userExists = await findByEmail(email);
        if (userExists) {
            res.status(409).json({
                msg: "user already exists"
            })
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const userObj = {
            username,
            email,
            hashPassword
        }
        const createUserInDB = await createUser(userObj);
        if (!createUserInDB) {
            throw new Error("error while creating user");
        }
        else {
            res.status(201).json({
                msg: "user successfully created",
                user: createUserInDB
            })
        }

    } catch (error) {
        console.error("Error while registering the user");
        res.status(500);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userExists = await findByEmail(email);
        if (!userExists) {
            console.log("user doesnt exists");
            res.status(409).json({
                msg: "user doesnt exists"
            })
        }
        const matchPass = await bcrypt.compare(password, userExists.password);
        if (!matchPass) {
            res.status(401).json({
                msg: "wrong credentials"
            })
        }
        const { accessToken, refreshToken } = generateTokens(userExists.id);
        const userAgent = req.headers["user-agent"];
        const refTokenObj: refreshTokenType = {
            token: refreshToken,
            deviceInfo: userAgent!,
            ipAddr: "",
            userId: userExists.id,
        }
        const saveRefreshToken = await insertRefreshToken(refTokenObj);
        if (!saveRefreshToken) {
            throw new Error("error while saving token")
        }

        res.cookie('refresh_token', refreshToken, {
            secure: false,
            sameSite: 'lax',
            httpOnly: false
        })
        res.status(201).json({
            msg: "logged in",
            accessToken: accessToken,
            user: userExists.username
        })
    } catch (error) {
        console.error("error while logging in");
        res.status(500);
    }

}

export const uploadNote = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error("file not found");
        };
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        const result = await cloudinary.uploader.upload(req.file?.path);
        console.log(result);
        const extract = await main(req.file.path);
        if (!extract) {
            throw new Error("error while extraction and emb")
        }
        console.log("just the embeddings \n", extract[0].embeddings)
        console.log("\n", extract[1])
        const content = JSON.parse(extract[1])

        console.log(typeof content);
        console.log(typeof content[0]);

        const embeddingsFromPythonService = extract[0].embeddings[0];
        const extracedTextFromImg = content[0].pageContent;
        const tagsForImg = content[0].metaData.tags
        console.log("just the pageContent \n", content[0].pageContent)
        console.log(typeof extracedTextFromImg)
        console.log(typeof tagsForImg)
        console.log(typeof embeddingsFromPythonService)
        console.log(Array.isArray(extract[0].embeddings));      // true
        console.log(Array.isArray(extract[0].embeddings[0]));   // true
        console.log(typeof extract[0].embeddings);              // object (normal for arrays)
        console.log(extract[0].embeddings[0].length);
        const insertEmbToDb = await insertEmbAndContent(embeddingsFromPythonService, extracedTextFromImg, tagsForImg);
        if (insertEmbToDb) {
            await unlink(req.file.path);
            console.log("file deleted from server");
        }

        return res.status(201).json({
            success: true,
            msg: "image uploaded successfully"
        })

    } catch (error) {
        console.error("error while uploading");
        return res.status(500).json({
            success: false,
            msg: "upload failed"
        })
    }
}

export const serachQuery = async () => {
    try {
        const userQuery = "what is process?";
        const userQueryObj: responseType = {
            extractedText: userQuery,
            relatedTags: ""
        };
        const docQuery = documentConversionText(userQueryObj);
        if (!docQuery) throw new Error("error while conv query to doc")
        const chunkedQuery = await chunkingText(docQuery);
        const resVec = await textToVecEmb(undefined, chunkedQuery);
        const queryVec = resVec.embeddings[0];
        const topResult = await semanticSearch(queryVec);
        console.log(topResult);
        return [topResult.contents, userQuery];
    } catch (error) {
        console.error("error while getting the semantic result");
    }
}
//serachQuery();
//
export const chatBot = async () => {
    try {
        const ai = new GoogleGenAI({});
        const context = await serachQuery();
        if (!context) return null;
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: [
                {
                    role: "user",
                    parts: [{ text: "hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Great to meet you. What would you like to know?" }],
                },
            ],
            config: {
                systemInstruction: `You are an expert assistant specialized in answering questions strictly based on OCR-extracted documents.
Instructions:
- Use ONLY the provided context to answer the user’s question.
- If the answer exists in the context, paraphrase it clearly and accurately.
- Be resilient to OCR errors such as broken words, incorrect spacing, missing characters, or misspellings.
- Do not use world knowledge unless explicitly permitted.
Here is the Context ${context[0]}

Response Format:
Repeat The Query
Answer:
<your answer>
`
            }
        });

        const stream1 = await chat.sendMessageStream({
            message: `${context[1]}`,
        });
        for await (const chunk of stream1) {
            console.log(chunk.text);
            console.log("_".repeat(80));
        }

        const stream2 = await chat.sendMessageStream({
            message: "what is context switching?",
        });
        for await (const chunk of stream2) {
            console.log(chunk.text);
            console.log("_".repeat(80));
        }
    } catch (err) {
        console.error(err, "error with chatbot")
    }
}

chatBot();
