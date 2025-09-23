import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    model: "gpt-4.1",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  return resp.choices[0].message.content;
}
