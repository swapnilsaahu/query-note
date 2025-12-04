import { Request, Response } from "express";
import { createUser, findByEmail } from "../db/users-repository";
import bcrypt from "bcrypt";

export interface userType {
    username: string,
    email: string,
    hashPassword: string
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
