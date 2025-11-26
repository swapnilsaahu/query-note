import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function main() {
    const ai = new GoogleGenAI({});
    const base64ImageFile = fs.readFileSync("../../assets/20251117_163718.jpg", {
        encoding: "base64",
    });
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64ImageFile,
                },
            },
            { text: "Extract the text from the image and convert it into format which would be most suitable when converting the text to langchain's Document, the image provided is a handwritten note." }
        ],
    });
    console.log(result.text);
}

main();
