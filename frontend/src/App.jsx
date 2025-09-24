import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const uploadPdf = async () => {
    const formData = new FormData();
    formData.append("pdf", file);
    await axios.post("http://localhost:4000/upload", formData);
    alert("Indexed!");
  };

  const ask = async () => {
    const res = await axios.post("http://localhost:4000/chat", { question });
    setAnswer(res.data.answer);
  };

  return (
    <div className="flex h-screen">
      {/* Left: Upload */}
      <div className="w-1/2 p-4 border-r flex flex-col gap-4">
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        <button onClick={uploadPdf} className="bg-blue-600 text-white p-2 rounded">Upload & Index</button>
      </div>

      {/* Right: Chat */}
      <div className="w-1/2 p-4 flex flex-col">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="border p-2 mb-2 flex-1"
          placeholder="Ask a question about the PDF..."
        />
        <button onClick={ask} className="bg-green-600 text-white p-2 rounded mb-2">Ask</button>
        <div className="border p-2 flex-1 overflow-auto">{answer}</div>
      </div>
    </div>
  );
}
