import { Request, Response } from "express";
import { createUser, doesRefreshTokenExists, findByEmail, insertEmbAndContent, insertMetaData, insertRefreshToken, semanticSearch } from "../db/users-repository";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { pipeLineFromOcrToEmb } from "../services/text-extraction-ocr";
import { unlink } from "fs/promises";
import { uploadService } from "../services/upload-service";
import { UploadApiResponse } from "cloudinary";


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
type position = "start" | "end" | "middle";

export interface insertVectorObjType {
    emb: Array<number>,
    contents: string,
    tag: string,
    img_link: string,
    user_id: string,
    position: position
}
export const JWT_SECRET = "asdjhfouashtp0wehp9uohpodfhjsdhfuoas";

const generateTokens = (userID: string): { accessToken: string, refreshToken: string, jwtId: string } => {
    const jwt_id = uuidv4();
    const accessTokenJWT = jwt.sign({
        userId: userID
    }, JWT_SECRET, {
        expiresIn: "15m"
    })
    const refreshTokenJWT = jwt.sign({
        userId: userID
    }, JWT_SECRET, {
        expiresIn: "10d",
        jwtid: jwt_id
    })
    return { accessToken: accessTokenJWT, refreshToken: refreshTokenJWT, jwtId: jwt_id }
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
                msg: "user already exi"
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
                user: createUserInDB,
                success: true
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
            console.log("user doesnt exi");
            res.status(409).json({
                msg: "user doesnt exi"
            })
        }
        const matchPass = await bcrypt.compare(password, userExists.password);
        if (!matchPass) {
            res.status(401).json({
                msg: "wrong credentials"
            })
        }
        const { accessToken, refreshToken, jwtId } = generateTokens(userExists.id);
        const saveJwtid = await insertRefreshToken(jwtId, userExists.id);
        if (!saveJwtid) {
            throw new Error("error while saving jwt id");
        }
        res.cookie('refresh_token', refreshToken, {
            secure: false,
            sameSite: 'lax',
            httpOnly: false
        })
        res.status(201).json({
            msg: "logged in",
            accessToken: accessToken,
            user: userExists.username,
            success: true
        })
    } catch (error) {
        console.error("error while logging in");
        res.status(500);
    }

}

export const uploadNote = async (req: Request, res: Response) => {
    try {
        console.log("req reaching upload note")
        console.log(req.file?.path)
        if (!req.file) {
            return res.status(404).json({
                msg: "file not found"
            });
        }
        const uploadFile = await uploadService(req.file?.path); //img cloud upload
        if (!uploadFile) throw new Error("failed to upload");
        const extractedTextAndEmb = await pipeLineFromOcrToEmb(req.file.path); //ocr to emb
        if (!extractedTextAndEmb) {
            throw new Error("error while extraction and emb")
        }
        console.log("just the embeddings \n", extractedTextAndEmb[0].embeddings)
        console.log("\n", extractedTextAndEmb[1])
        const content = JSON.parse(extractedTextAndEmb[1])
        const { position } = req.body;
        if (!position) {
            console.log("position not available");
        }
        console.log("positon", position);
        // console.log(typeof content);
        // console.log(typeof content[0]);

        // const embeddingsFromPythonService = extractedTextAndEmb[0].embeddings[0];
        // const extracedTextFromImg = content[0].pageContent;
        // const tagsForImg = content[0].metaData.tags
        console.log("just the pageContent \n", content[0].pageContent)

        const userId = req.user.userId
        const insertObjForDB: insertVectorObjType = {
            emb: extractedTextAndEmb[0].embeddings[0],
            contents: content[0].pageContent,
            tag: content[0].metaData.tags,
            img_link: uploadFile.url,
            user_id: userId,
            position: position
        }

        const insertMetaDataForNav = {
            user_id: userId,
            subject: content[0].metaData.tags
        }
        const insertEmbToDb = await insertEmbAndContent(insertObjForDB);
        const insertMetaToDb = await insertMetaData(insertMetaDataForNav);
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

export const refreshTokens = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) {
            return res.status(401).json({ msg: "no token" })
        }

        jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ msg: "token expired" })
            }

            const { userId, jwtid } = decoded;

            const checkToken = await doesRefreshTokenExists(jwtid);
            if (!checkToken) {
                //logoutUser();
            }
            const accessToken = jwt.sign({
                userId: userId
            }, JWT_SECRET, {
                expiresIn: "15m"
            })

            res.status(201).json({
                msg: "logged in",
                accessToken: accessToken
            })
        })
    } catch (err) {
        console.error("error while refreshing tokens", err);
        return res.status(500).json({
            msg: "error while refreshing tokens"
        })
    }
}
export const verifiedUser = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        msg: "verified user"
    })
}
// export const logoutUser = async () => {
//     try {
//
//     } catch (err) {
//         console.error("error while logging out")
//     }
// }

