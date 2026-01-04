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
        const resVec = await documentTextToVec(chunkedQuery);
        const queryVec = resVec.embeddings[0];
        const topResult = await semanticSearch(queryVec);

        console.log(topResult);
        return [topResult.contents, topResult.img_link, topResult.sequence];
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

Explain the following topic in clear, complete detail for a learner.
Do NOT summarize or give a short answer.

Your explanation should:
- Fully explain the idea from basics to understanding
- Include explanations, examples, and interpretations where relevant
- Address why the topic is important or meaningful
- Clarify common confusions or misunderstandings

Write in complete paragraphs with sufficient depth.
Avoid brief or one-line responses.

Guidelines:
- Treat the retrieved context as the primary source of truth, but you may use general knowledge to clarify, connect ideas, or enhance explanations.
- If a user’s question cannot be fully answered from the context alone, you may provide a partial answer using reasoning, but clearly note which part is not directly supported by the text.
- If the context contains OCR imperfections (typos, broken words, incomplete lines), interpret them as best as possible.
- Do not hallucinate specific facts (dates, numbers, names) that are not present or inferable.
- Keep your explanations helpful, direct, and easy to understand.
- If the context does not fully answer the question, note which parts are assumed or based on general reasoning.
Here is the following context which you need to consider ${context[0]}
- Write in well-formed paragraphs with clear logical flow.
- Don't Give markdown
`,
            },
        });
        console.log(response.text);
        return [response.text, context[1], context[2]];

    } catch (err) {
        console.error(err, "error with chatbot")
    }
}

