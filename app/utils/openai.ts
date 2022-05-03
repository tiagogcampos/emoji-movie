import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})

export const openAI = new OpenAIApi(configuration);

const basePrompt = `Guess the name of the movie from emojis`


export function generatePrompt(emojis: string): string {
    const prompt = `${basePrompt}: ${emojis}`

    return prompt;
}