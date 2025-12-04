import { userType } from "../controllers/user-controller.ts";
import { pool } from "./db.ts";
export const findByEmail = async (email: string) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE email=$1',
            values: [email]
        }
        const result = await pool.query(query);
        if (result.rows.length === 0) {
            console.log("no user found");
            return null;
        } else {
            console.log("user found:", result.rows[0]);
            return result.rows[0];
        }
    } catch (error) {
        console.error("error while querying the db");
        return;
    }
}

export const createUser = async (dataObj: userType) => {
    try {
        const query = {
            text: 'INSERT INTO users (email,username,password) VALUES ($1,$2,$3) RETURNING id,email,username,created_at',
            values: [dataObj.email, dataObj.username, dataObj.hashPassword]
        }
        const result = await pool.query(query);
        if (result.rowCount && result.rowCount > 0) {
            console.log("user created");
            return result.rows[0];
        } else {
            throw new Error("failed to insert user");
        }
    } catch (error) {
        console.error("error while inserting");
        return false;
    }
}
