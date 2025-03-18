import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      setReview("⚠️ Please enter some code to review.");

      // Clear message after 3 seconds
      setTimeout(() => setReview(""), 3000);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review. Please try again.");
      console.error(error);

      // Clear message after 3 seconds
      setTimeout(() => setReview(""), 3000);
    }
  }

  return (
    <>
      <header>
        <h1>AI Code Reviewer</h1>
      </header>
      <main>
        <div className="left">
          <div className="editor-container">
            {!code && (
              <div className="placeholder">
                Type your code to be reviewed...
              </div>
            )}
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                width: "100%",
                minHeight: "100%",
                color: "#f8f8f2",
                overflow: "auto", // Enable scroll for large code
                whiteSpace: "pre-wrap", // Wrap long lines if needed
              }}
            />
          </div>
          <button onClick={reviewCode} className="review">
            Review
          </button>
        </div>
        <div
          className="right"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace"',
            fontSize: 16,
            height: "100%",
            width: "100%",
            color: "#f8f8f2",
            position: "relative",
          }}
        >
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
