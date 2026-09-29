# DevGuru — AI Coding Mentor Agent 🧑‍💻

> **Sanity Challenge Path One Submission** — Ship an Agent That Queries Real Content

DevGuru is an AI-powered coding mentor that provides **grounded, hallucination-free** answers from a curated Knowledge Base stored in Sanity. Every answer comes with **verifiable source citations**.

## Features

- 🤖 **AI-Powered Chat** — Ask coding questions in natural language
- 📚 **Grounded Answers** — Responses come only from verified Knowledge Base content
- 📎 **Source Citations** — Every answer links to its source documents
- 🔒 **No Hallucinations** — Says "I don't know" if the answer isn't in the KB
- 🎨 **Beautiful UI** — Dark-mode chat interface with syntax highlighting
- 📊 **7 Topics** — React, Next.js, TypeScript, Node.js, CSS, Git, JavaScript

## Tech Stack

- **Next.js 15** + React 19 + TypeScript
- **Sanity** — Content Lake + Knowledge Base + GROQ
- **Google Gemini API** — Grounded AI generation
- **Tailwind CSS** — Styling

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Sanity project ID, dataset, and Gemini API key

# Seed the Knowledge Base
npm run seed

# Run the development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
GEMINI_API_KEY=your_gemini_key
```

## How It Works

```
User Question → Search Sanity Knowledge Base (GROQ)
                        ↓
                Relevant Documents Found
                        ↓
            Gemini AI + Context Grounding
                        ↓
        Grounded Answer + Source Citations
```

## License

MIT
