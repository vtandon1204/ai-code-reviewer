import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { FaLinkedin, FaGithub, FaUser } from "react-icons/fa";
import "./App.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function App() {
  // State variables
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Function to handle code review
  async function reviewCode() {
    if (!code.trim()) {
      setReview("⚠️ Please enter some code to review.");
      setTimeout(() => setReview(""), 3000);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/ai/get-review`, { code });
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review. Please try again.");
      console.error(error);
      setTimeout(() => setReview(""), 3000);
    }
  }

  // Close the contact dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".contact-menu") && !event.target.closest(".contact-btn")) {
        setShowContacts(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <header>
        <h1>AI CodeX</h1>
      </header>
      <main>
        <div className="left">
          <div className="editor-container">
            {!code && <div className="placeholder">Type your code to be reviewed...</div>}
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                width: "100%",
                minHeight: "100%",
                color: "#f8f8f2",
                overflow: "auto",
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
          <button onClick={reviewCode} className="review">
            Review
          </button>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>

      {/* Contact Button */}
      <div className="contact-container">
        <button className="contact-btn" onClick={() => setShowContacts(!showContacts)}>
          <FaUser size={24} />
        </button>

        {/* Contact Dropdown */}
        {showContacts && (
          <div className="contact-menu">
            <a href="https://www.linkedin.com/in/vtandon1204/" target="_blank" rel="noopener noreferrer" className="linkedin">
              <FaLinkedin /> LinkedIn
            </a>
            <a href="https://github.com/vtandon1204" target="_blank" rel="noopener noreferrer" className="github">
              <FaGithub /> GitHub
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
