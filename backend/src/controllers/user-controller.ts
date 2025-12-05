import { Request, Response } from "express";
import { createUser, findByEmail, insertRefreshToken } from "../db/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

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
