import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../controllers/user-controller";

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: "token missing" });
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ msg: 'invalid or expired token' })
            }
            req.user = decoded;
            console.log("verified user");
            next();
        });
    } catch (err) {
        console.error("error during jwt auth");
        res.status(500).json({
            msg: "server err"
        })
    }
}
