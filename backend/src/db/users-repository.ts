import { insertVectorObjType, refreshTokenType, userType } from "../controllers/user-controller.ts";
import { pool } from "./db.ts";
import { toSql } from "pgvector";
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

export const insertRefreshToken = async (jwtId: string, userId: string) => {
    try {
        const query = {
            text: `INSERT INTO refresh_tokens (jwt_id,user_id,expires_at) VALUES ($1,$2,NOW() + INTERVAL '10 days') RETURNING created_at`,
            values: [jwtId, userId]
        }
        const result = await pool.query(query);
        if (result.rowCount && result.rowCount > 0) {
            console.log('token id inserted');
            return result.rows[0];
        } else {
            throw new Error;
        }
    } catch (err) {
        console.error("error while inserting refresh token", err);
        return false;
    }
}

export const insertEmbAndContent = async (vecObj: insertVectorObjType) => {
    try {
        const { emb, img_link, contents, user_id, tags } = vecObj;
        const vector = toSql(emb); //important convert to pgvector format {1,2,3,4} to [1,2,3,4] pgvector doesnt accept curly brackets
        const query = {
            text: 'INSERT INTO notes (vec_emb,contents,tags,user_id,img_link) VALUES ($1,$2,$3,$4,$5)',
            values: [vector, contents, tags, user_id, img_link]
        }
        const result = await pool.query(query);
        console.log("whats going on", result)
        if (result.rowCount && result.rowCount > 0) {
            console.log("vectors inserted");
            return true;
        }
    } catch (err) {
        console.error("error while inserting vectors to db", err);
        return false;
    }
}

export const semanticSearch = async (emb: any) => {
    try {
        const vector = toSql(emb);
        const query = {
            text: 'SELECT * FROM notes ORDER BY vec_emb <=> $1 LIMIT 5',
            values: [vector]
        }
        const result = await pool.query(query);
        if (result.rows.length === 0) {
            console.log("no emb found")
            return null;
        } else {
            console.log("found note:", result.rows[0])
            return result.rows[0];
        }

    } catch (err) {
        console.error(err)
        return false
    }
}

export const doesRefreshTokenExists = async (jwtId: string) => {
    try {
        const query = {
            text: 'SELECT 1 FROM refresh_tokens WHERE jwt_id=$1 LIMIT 1',
            values: [jwtId]
        }
        const result = await pool.query(query);
        return result.rowCount && result.rowCount > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}
