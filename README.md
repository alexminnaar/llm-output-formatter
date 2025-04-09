# Streaming LLM Markdown Formatting Example Project

This is a simple React app that lets you enter a prompt on the left, sends it to the OpenAI API, and streams back the result as rendered Markdown on the right.  Formatting is done in a similar fashion to [HinterviewGPT](https://hinterviewgpt.com/). It supports:

- ✅ Markdown formatting
- ✅ LaTeX (via KaTeX)
- ✅ Syntax-highlighted code blocks
- ✅ Streaming responses from OpenAI

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/alexminnaar/llm-output-formatter.git
cd llm-output-formatter.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenAI API key

Create a .env file in the root:

```bash
REACT_APP_OPENAI_API_KEY=your-openai-key-here
```

### 4. Start the app

```bash
npm start
```

It’ll open at http://localhost:3000