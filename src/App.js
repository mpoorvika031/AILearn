import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const chatEndRef = useRef(null);

  // 🔄 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // 🔊 Voice output
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 💬 Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, mode }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);

      speak(data.reply);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error" },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  // 📄 Upload file
  const uploadFile = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    alert("File uploaded successfully");
  };

  // 🎤 Voice input
  const startVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.start();

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
  };

  // 🎨 Image generation
  const generateImage = async () => {
    if (!imagePrompt) return;

    const res = await fetch("http://localhost:5000/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });

    const data = await res.json();
    setImageUrl(data.url);
  };

  // 🧠 Quiz generator
  const generateQuiz = async () => {
    const res = await fetch("http://localhost:5000/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: message, mode }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      { role: "bot", text: data.quiz },
    ]);
  };

  // 🎯 Mode selection screen
  if (!mode) {
    return (
      <div className="mode">
        <h1>StudyGPT</h1>
        <p>Select your learning mode</p>

        <button onClick={() => setMode("kids")}>👶 Kids</button>
        <button onClick={() => setMode("student")}>🎓 Student</button>
        <button onClick={() => setMode("teacher")}>👩‍🏫 Teacher</button>
      </div>
    );
  }

  return (
    <div className="main">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>StudyGPT</h2>

        <button onClick={() => setMode("kids")}>Kids Mode</button>
        <button onClick={() => setMode("student")}>Student Mode</button>
        <button onClick={() => setMode("teacher")}>Teacher Mode</button>

        <hr />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload PDF</button>

        <button onClick={generateQuiz}>Generate Quiz</button>

        <hr />

        <input
          placeholder="Generate image..."
          onChange={(e) => setImagePrompt(e.target.value)}
        />
        <button onClick={generateImage}>Generate Image</button>

        {imageUrl && (
          <img src={imageUrl} alt="Generated" style={{ width: "100%", marginTop: "10px" }} />
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-area">

        <div className="messages">

          {chat.length === 0 && (
            <h2 style={{ textAlign: "center", opacity: 0.5 }}>
              Ask anything about your document...
            </h2>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={msg.role === "user" ? "user" : "bot"}
            >
              {msg.text}
            </div>
          ))}

          {loading && <div className="bot">⏳ Thinking...</div>}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>Send</button>
          <button onClick={startVoice}>🎤</button>
        </div>

      </div>

    </div>
  );
}

export default App;