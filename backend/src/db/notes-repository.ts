import ta from "zod/v4/locales/ta";
import { pool } from "./db.ts";
import { toSql } from "pgvector";
import { text } from "express";

export const getNextNotes = async (userId: string, tag: string, largestTimestamp: string) => {
    const query = {
        text: 'SELECT img_link,created_at FROM notes WHERE user_id=$1 AND tag=$2 AND created_at > $3 ORDER BY created_at ASC LIMIT 10',
        values: [userId, tag, largestTimestamp]
    }
    const result = await pool.query(query);
    console.log("found notes", result.rows);
    return result.rows;
}
export const getPrevNotes = async (userId: string, tag: string, smallestTimestamp: string) => {
    const query = {
        text: 'SELECT img_link,created_at FROM notes WHERE user_id=$1 AND tag=$2 AND created_at < $3 ORDER BY created_at DESC LIMIT 10',
        values: [userId, tag, smallestTimestamp]
    }
    const result = await pool.query(query);
    console.log("found notes", result.rows);
    return result.rows;
}
export const getInitialNotes = async (userId: string, tag: string) => {
    const query = {
        text: 'SELECT img_link,created_at FROM notes WHERE user_id=$1 AND tag=$2 ORDER BY created_at ASC LIMIT 10',
        values: [userId, tag]
    }
    const result = await pool.query(query);
    console.log("found notes", result.rows);
    return result.rows;
}
export const getNavNotes = async (userId: string) => {
    const query = {
        text: 'SELECT * FROM notes_metadata WHERE user_id=$1',
        values: [userId]
    }
    const result = await pool.query(query);
    console.log("found", result.rows);
    return result.rows;
}
