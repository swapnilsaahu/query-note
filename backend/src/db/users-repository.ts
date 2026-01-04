import { insertVectorObjType, userType } from "../controllers/user-controller.ts";
import { pool } from "./db.ts";
import { toSql } from "pgvector";
import { Decimal } from 'decimal.js';
export const findByEmail = async (email: string) => {
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
}

export const createUser = async (dataObj: userType) => {
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
}

export const insertRefreshToken = async (jwtId: string, userId: string) => {
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
}

export const insertEmbAndContent = async (vecObj: insertVectorObjType) => {
    const { emb, img_link, contents, user_id, tag, position } = vecObj;
    const vector = toSql(emb); //important convert to pgvector format {1,2,3,4} to [1,2,3,4] pgvector doesnt accept curly brackets
    console.log("converted emb to pgvector format");
    const resMaxAndMin = await getMaxAndMinValueNotesSequence();

    //for ordering of the pages ex:- 10,20,30 new at the end 40, if middle first and second page 10+20/2=15, and if start 
    //10-10=0 so sequence can look like -10,0,10,15,20,30
    //use decimaljs to avoid precision issue returned value from maxmin is string for exact representation, pass string sequence value
    //pg will handle conversion to numeric
    console.log(resMaxAndMin);
    console.log(resMaxAndMin.rows[0]);
    const maxValue = new Decimal(resMaxAndMin.rows[0].max_value || "0");
    const minValue = new Decimal(resMaxAndMin.rows[0].min_value || "0");
    console.log("max and min values", maxValue, minValue);
    let sequenceValue = new Decimal("0");
    if (position === "start") {
        sequenceValue = minValue.minus(10);
    } else if (position === "end") {
        sequenceValue = maxValue.plus(10);
    } else {
        sequenceValue = (minValue.plus(maxValue)).div("2");
    }

    const query = {
        text: 'INSERT INTO notes (vec_emb,contents,tag,user_id,img_link,sequence) VALUES ($1,$2,$3,$4,$5,$6)',
        values: [vector, contents, tag, user_id, img_link, sequenceValue.toString()]
    }
    const result = await pool.query(query);
    console.log("whats going on", result);

    if (result.rowCount && result.rowCount > 0) {
        console.log("vectors inserted");
        return true;
    }
}

export const semanticSearch = async (emb: any) => {
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

}

export const doesRefreshTokenExists = async (jwtId: string) => {
    const query = {
        text: 'SELECT 1 FROM refresh_tokens WHERE jwt_id=$1 LIMIT 1',
        values: [jwtId]
    }
    const result = await pool.query(query);
    return result.rowCount && result.rowCount > 0;
}

const getMaxAndMinValueNotesSequence = async () => {
    const query = {
        text: 'SELECT MIN(sequence) AS min_value, MAX(sequence) AS max_value FROM notes'
    }
    const result = await pool.query(query);
    return result;
}
