import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { Document, DocumentInterface } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";

interface resposeType {
    extractedText: string;
    relatedTags: string;
}
const responseSchema: resposeType = {
    "extractedText": "string",
    "relatedTags": "string"
}
export async function textExtractionOcr(filePath: string) {
    const ai = new GoogleGenAI({});
    const base64ImageFile = fs.readFileSync(filePath, {
        encoding: "base64",
    });
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: responseSchema,
        },
        contents: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64ImageFile,
                },
            },
            { text: "Extract the text from the image and make sure to preserve the new lines, bullet points, seperators etc,also give related tags at most 5 for better indexing it should be comma seperated, returned format should be in JSON where extractedText is one key and another key is for relatedTags." }
        ],
    });
    console.log(result.text);
    const modifedResult = JSON.parse(result.text!);
    if (result.text) {
        console.log("extracted_text are as follows: ", modifedResult.extractedText);
        console.log("related_tags are as follows: ", modifedResult.relatedTags);
    }
    return modifedResult;
}

export const documentConversionText = (llmResponse: resposeType) => {
    try {
        const { extractedText, relatedTags } = llmResponse;
        const documents = [
            new Document({
                pageContent: extractedText,
                metadata: { tags: relatedTags },
            }),
        ];

        console.log("following is the result of conversion to document", documents);
        return documents;
    } catch (error) {
        console.error("error while doc conversion");
    }
}

export const chunkingText = async (documents: DocumentInterface[]) => {
    try {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const allSplits = await textSplitter.splitDocuments(documents);

        const jsonResponse = JSON.stringify(allSplits.map(doc => ({
            pageContent: doc.pageContent,
            metaData: doc.metadata
        })))

        return jsonResponse;

    } catch (error) {
        console.error("error while chunking")
    }
}
export const main = async (filePath: string) => {
    try {
        const result = await textExtractionOcr(filePath);
        const doc = documentConversionText(result);
        if (!doc) throw new Error
        const chunks = await chunkingText(doc);
        console.log("following are the chunks", chunks);


        const url = "http://localhost:8000/embed/search_query";
        const res = await axios.post(
            "http://localhost:8000/embed/search_query",
            chunks,    // <-- send array directly
            {
                headers: { "Content-Type": "application/json" }
            }
        );
        console.log("final vector embeddings", res.data);
        return [res.data, chunks];
    } catch (error) {
        console.error("error while executing main")
    }
}
