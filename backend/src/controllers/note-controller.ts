import { Request, Response } from "express";
import { getInitialNotes, getNavNotes, getNextNotes, getPrevNotes } from "../db/notes-repository";

interface ParamsType {
    tag: string;
}

interface QueryType {
    smallestTimestamp?: string;
    largestTimestamp?: string;
    dir?: "next" | "prev"
}
export const getNotes = async (req: Request<ParamsType, any, any, QueryType>, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        let result;
        const { userId } = req.user!;
        const { tag } = req.params;
        const { smallestTimestamp, largestTimestamp, dir } = req.query;

        if (largestTimestamp && dir === "next") {
            result = await getNextNotes(userId, tag, largestTimestamp);
        }
        else if (smallestTimestamp && dir === "prev") {
            result = await getPrevNotes(userId, tag, smallestTimestamp);
        }
        else {
            result = await getInitialNotes(userId, tag);
        }

        if (result.length === 0) {
            return res.status(200).json({
                rows: [],
                largestTimestamp: null,
                smallestTimestamp: null,
                msg: "no notes found"
            })
        }
        const notes = result.map(note => note.img_link)
        return res.status(200).json({
            rows: notes,
            smallestTimestamp: new Date(result[0].created_at).toISOString(),
            largestTimestamp: new Date(result[result.length - 1].created_at).toISOString(),
        })

    } catch (error) {
        console.error("error while getting notes", error);
        res.status(500).json({
            msg: "error while getting notes"
        })
    }
}

export const getNavBarNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user;

        const result = await getNavNotes(userId);

        return res.status(200).json({
            structure: result
        })
    } catch (error) {
        console.error("server error", error);
        res.status(500).json({
            msg: "server error"
        })
    }
}
