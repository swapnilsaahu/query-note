import { GoogleGenAI } from "@google/genai";
import { chunkingText, documentConversionText, documentTextToVec, responseType } from "./text-extraction-ocr";
import { semanticSearch } from "../db/users-repository";

export const serachQuery = async (query: string) => {
    try {
        const userQuery = query;
        const userQueryObj: responseType = {
            extractedText: userQuery,
            relatedTags: ""
        };
        const docQuery = documentConversionText(userQueryObj);
        if (!docQuery) throw new Error("error while conv query to doc");

        const chunkedQuery = await chunkingText(docQuery);
        const resVec = await documentTextToVec(undefined, chunkedQuery);
        const queryVec = resVec.embeddings[0];
        const topResult = await semanticSearch(queryVec);

        console.log(topResult);
        return [topResult.contents, userQuery];
    } catch (error) {
        console.error("error while getting the semantic result");
    }
}


export const llmRequestWithPrompt = async (query: string) => {
    try {
        const ai = new GoogleGenAI({});
        const context = await serachQuery(query);
        if (!context) return null;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${query}`,
            config: {
                systemInstruction: `
You are an expert AI assistant highly skilled in understanding, interpreting, and reasoning over textual information retrieved from documents.

Your goal is to give clear, helpful, and accurate answers by combining:
- the provided context (retrieved chunks),
- your reasoning abilities, and
- general background knowledge when appropriate,
- give like 3 to 5 lines not single line response, add your reasoning if needed

Guidelines:
- Treat the retrieved context as the primary source of truth, but you may use general knowledge to clarify, connect ideas, or enhance explanations.
- If a user’s question cannot be fully answered from the context alone, you may provide a partial answer using reasoning, but clearly note which part is not directly supported by the text.
- If the context contains OCR imperfections (typos, broken words, incomplete lines), interpret them as best as possible.
- Do not hallucinate specific facts (dates, numbers, names) that are not present or inferable.
- Keep your explanations helpful, direct, and easy to understand.

Answer Structure:
1. **Answer** — the best possible answer integrating the context and your reasoning.
2. **Context Support** — bullet points summarizing which parts of the provided context helped you answer.
   - If the context does not fully answer the question, note which parts are assumed or based on general reasoning.
Here is the following context which you need to consider ${context[0]}
`,
            },
        });
        console.log(response.text);
        return response.text;

    } catch (err) {
        console.error(err, "error with chatbot")
    }
}

