import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState('');
  const [markdownOutput, setMarkdownOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const preprocessLaTeX = (content) => {
    return content
      .replace(/\\\[(.*?)\\\]/gs, (_, eq) => `$$${eq}$$`)   // block math
      .replace(/\\\((.*?)\\\)/gs, (_, eq) => `$${eq}$`);    // inline math
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setMarkdownOutput('');
    setLoading(true);

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [{ role: 'user', content: input }],
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          setMarkdownOutput((prev) => prev + delta);
        }
      }
    } catch (error) {
      console.error('Error streaming from OpenAI:', error);
      setMarkdownOutput('⚠️ Error streaming response from OpenAI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '10px 20px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ margin: 0 }}>Streaming LLM Markdown Formatting</h2>
      </header>

      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ flex: 1, padding: 20, borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <h3>Prompt Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a markdown task or question..."
            style={{
              height: 200,
              width: '100%',
              padding: 10,
              paddingRight: 12,
              fontSize: 16,
              fontFamily: 'monospace',
              border: '1px solid #ccc',
              borderRadius: 4,
              resize: 'vertical',
              marginBottom: 10,
              boxSizing: 'border-box',
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </div>

        <div style={{ flex: 1, padding: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <h3>OpenAI Response (Formatted)</h3>
          <div
            style={{
              flex: 1,
              border: '1px solid #ccc',
              padding: 16,
              borderRadius: 4,
              backgroundColor: '#fdfdfd',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            <ReactMarkdown
              children={preprocessLaTeX(markdownOutput)}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            />
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
