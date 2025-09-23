import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

// Use your OpenRouter key stored in .env as OPENROUTER_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // important for OpenRouter
});

export async function chatWithPdf(userQuery) {
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    { url: "http://localhost:6333", collectionName: "pdf-collection" }
  );

  const relevant = await vectorStore.asRetriever({ k: 3 }).invoke(userQuery);

  const systemPrompt = `
    You are an assistant. Answer only using this context:
    ${JSON.stringify(relevant)}
  `;

  const resp = await client.chat.completions.create({
    model: "deepseek/deepseek-r1:free",   // ✅ DeepSeek model via OpenRouter
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  return resp.choices[0].message.content;
}
