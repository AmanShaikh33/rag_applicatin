import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function indexPdf(pdfPath) {
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

  await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "pdf-collection",
  });

  console.log("Indexing done");
}
