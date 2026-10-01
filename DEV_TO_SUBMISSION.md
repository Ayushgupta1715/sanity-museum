---
title: "The Living Museum: A 3D Spatial Universe Powered by Sanity Content Lake"
published: true
tags: sanitychallenge, sanity, nextjs, webdev
cover_image: https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/public/cover.png
canonical_url: https://sanity2-two.vercel.app
---

*This is a submission for the [Sanity Challenge, Path Two: Vibe-Code Something Strange](https://dev.to/challenges/sanity-2026-09-16)*

---

## 🏛️ What I Built

**The Living Museum** is an interactive, spatial 3D digital museum where human breakthroughs, artistic movements, and technological milestones are preserved as living, breathing artifacts.

Unlike traditional web applications where 3D scenes hardcode their geometry, lighting, and metadata, **The Living Museum is completely decoupled and driven dynamically by the Sanity Content Lake**.

### 🌟 Who is it for?
It is designed for curious minds, history enthusiasts, developers, and digital curators who want to experience historical and digital knowledge spatially rather than scrolling through flat documentation or wiki pages.

### 🔑 Key Capabilities:
* **🚶 Continuous 3D Movement:** A custom 60 FPS first-person controller supporting both desktop keyboard navigation (**W-A-S-D**) and an intuitive **4-Button Directional D-Pad** (Up, Down, Left, Right).
* **🏛️ Four Sequential Thematic Halls:**
  * **Room 1: Inventions** — Foundational breakthroughs from the Wheel and Printing Press to the Steam Engine, Telephone, and Internet.
  * **Room 2: Art** — Classical marble sculptures, indigenous folk crafts, traditional Indian art, and digital art.
  * **Room 3: History** — Historic computer relics and computing epochs.
  * **Room 4: Future** — Frontier AI architectures, space exploration, and autonomous systems.
* **🔍 Real-Time Exhibit Inspection (Modal):** Clicking any artifact displays its high-resolution image, creator, historical era, detailed story, live Sanity lifecycle status (`ACTIVE` / `COOLING` / `ARCHIVED`), and real-time vitality index bar.
* **🌙 Atmospheric Dark / Night Mode:** A one-click toggle shifts the skylight from daylight illumination into a dramatic nocturnal sanctuary with ambient spotlight lanterns.
* **🎛️ Mission Control Room:** A dedicated control room (`/control-room`) allowing curators to manipulate exhibit vitality scores and trigger cooling or revival protocols live without page reloads.

---

## 🎬 Demo

* 🌐 **Live Web Application (Vercel):** [https://sanity2-two.vercel.app](https://sanity2-two.vercel.app)
* 🎛️ **Mission Control Room:** [https://sanity2-two.vercel.app/control-room](https://sanity2-two.vercel.app/control-room)
* 🎨 **Sanity Studio CMS:** [https://sanity2-two.vercel.app/studio](https://sanity2-two.vercel.app/studio)

### 🎥 Video Walkthrough (1-Minute Tour)
Watch the complete interactive walkthrough below featuring continuous walking, room teleportation, exhibit inspection, and dark mode toggling:

{% youtube uMhCVwAp6Hk %}

---

## 💻 Code

The entire codebase is open-source and structured for easy extension:

{% embed https://github.com/Ayushgupta1715/sanity-museum %}

* **Repository:** [https://github.com/Ayushgupta1715/sanity-museum](https://github.com/Ayushgupta1715/sanity-museum)
* **License:** MIT

---

## ⚙️ My Build Process

### 🧠 The AI-Native IDE & Tools
I built this project using **Google Antigravity** paired with autonomous agentic workflows and the **Gemini CLI** engine. Building an ambitious 3D WebGL application integrated with a headless CMS in a single hackathon sprint required intense pair-programming and real-time vibe-coding.

### 💡 Prompts That Worked & What Failed
* **What Worked:**
  * Specifying component separation early: Instructing the model to keep Three.js rendering inside an isolated client component (`components/MuseumScene.tsx`) while managing UI overlays and modal states in React (`app/page.tsx`).
  * Creating a custom automated seeding script (`upload_to_sanity.js`) that used `@sanity/client` to batch-upload 40 distinct exhibit records with coordinates and asset links directly into the dataset.
* **Where Things Got Stuck & How I Course-Corrected:**
  * **Strict Type Errors on `@sanity/ui`:** During Vercel's production type-checking, `<Badge tone="...">` from `@sanity/ui` threw strict TypeScript mismatches. We resolved this by building a clean inline React badge system.
  * **Next.js 16 & Vercel Turbopack:** Vercel initially defaulted to looking for a static `dist` folder. We resolved this by explicitly configuring `vercel.json` with `"framework": "nextjs"` and upgrading to Next.js `16.3.8` to satisfy deployment health checks.
  * **CORS Access for Sanity Studio:** When embedding Sanity Studio directly at `/studio`, browser security blocked cross-origin requests. We used the Sanity CLI (`npx sanity cors add`) to whitelist our production Vercel domain with credentials.

---

## 📊 Sanity Project Details

The museum's entire dataset and schema definitions are hosted on Sanity:

* **Sanity Project ID:** `iidfd4sp`
* **Dataset:** `production`
* **Public Dataset Query Endpoint:**
  ```text
  https://iidfd4sp.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "exhibit"]
  ```

### Content Model Architecture
The core schema is `exhibit`, structured as:
```typescript
{
  name: 'exhibit',
  title: 'Museum Exhibit',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Exhibit Name' },
    { name: 'category', type: 'string', title: 'Category (Invention / Art / History / Future)' },
    { name: 'creator', type: 'string', title: 'Creator / Origin' },
    { name: 'era', type: 'string', title: 'Historical Era' },
    { name: 'description', type: 'text', title: 'Curatorial Description' },
    { name: 'image', type: 'image', title: 'Artifact Visual' },
    {
      name: 'control',
      type: 'object',
      title: 'Museum Telemetry',
      fields: [
        { name: 'lifecycle', type: 'string', options: { list: ['ACTIVE', 'COOLING', 'ARCHIVED', 'REVIVED'] } },
        { name: 'vitality', type: 'number', title: 'Vitality Index (0-100)' },
        { name: 'x', type: 'number' },
        { name: 'y', type: 'number' },
        { name: 'z', type: 'number' }
      ]
    }
  ]
}
```

---

## 🤖 Agent Session

The entire design, 3D coordinate mathematics, Next.js optimization, and Vercel pipeline orchestration were conducted collaboratively in an **Antigravity AI Agent Session**:

* **IDE / Platform:** Google Antigravity
* **Agent Capabilities:** Multi-turn file inspection, terminal execution, browser screenshot verification via Playwright, and headless video rendering with FFmpeg.
* **Transcripts:** Cleaned and saved within the repository history.

---

## 💬 Let's Connect!
Have questions about how Three.js meshes sync with Sanity GROQ listeners? Wondering how the 3D room coordinates were calculated? **Drop your thoughts and questions in the comments below!** Let's discuss the future of 3D spatial web experiences. 🚀
