import { DocumentInterface } from "@langchain/core/documents"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const chunkingText = async (document: DocumentInterface[]) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const allSplits = await textSplitter.splitDocuments(document);
    console.log(allSplits);
    return allSplits;
}

