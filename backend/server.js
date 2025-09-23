import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { indexPdf } from "./indexer.js";
import { chatWithPdf } from "./chat.js";

dotenv.config();
const app = express();
app.use(express.json());
const upload = multer({ dest: "uploads/" });

// Upload + index
app.post("/upload", upload.single("pdf"), async (req, res) => {
  await indexPdf(req.file.path);
  res.json({ message: "PDF indexed successfully" });
});

// Chat
app.post("/chat", async (req, res) => {
  const { question } = req.body;
  const answer = await chatWithPdf(question);
  res.json({ answer });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
