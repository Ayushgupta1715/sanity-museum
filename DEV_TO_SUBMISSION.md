---
title: "I Tried to Prompt a 3D Museum Into Existence. Then I Had to Teach Sanity to Remember Life and Death."
published: true
tags: devchallenge, sanitychallenge, sanity, ai
cover_image: https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/public/cover.png
canonical_url: https://sanity2-two.vercel.app
---

*This is a submission for the [Sanity Challenge, Path Two: Vibe-Code Something Strange](https://dev.to/challenges/sanity-2026-09-16)*

---

I started this hackathon with a deceptively simple question: **Why are digital museums still designed like e-commerce catalogs?**

Why do we browse humanity’s greatest breakthroughs, timeless artworks, and computing revolutions through flat grids of rectangular cards, pagination buttons, and filter sidebars?

A few days later, I was walking through a full 3D spatial museum rendered in real-time WebGL, navigating between marble pedestals with a custom on-screen D-Pad, battling Next.js compiler blockers on Vercel at 2 AM, building an in-world spatial control room, and teaching Sanity's Content Lake to remember which historical artifacts were "alive," "cooling," or "dead."

That escalation probably tells you most of what you need to know about how this project went.

The result is **The Living Museum: A 3D Spatial Universe Powered by Sanity**.

Instead of browsing human history, art, and innovation as an e-commerce feed, The Living Museum turns collective memory into an explorable, physical world.

* You walk through sequential halls.
* Artifacts stand on illuminated physical pedestals.
* Approaching an exhibit halts time and opens its curatorial provenance.
* A single atmospheric toggle shifts the skylight from daylight illumination into a dramatic midnight sanctuary.
* And underneath it all, Sanity doesn't just store text and images — it acts as the spatial memory and lifecycle engine for the entire 3D universe.

The question behind the project eventually became:

> **What if structured content had physical geography and biological vitality?**

---

## 🔗 Project Links

* 🌐 **Live 3D Museum:** [https://sanity2-two.vercel.app](https://sanity2-two.vercel.app)
* 🎛️ **Mission Control Room:** [https://sanity2-two.vercel.app/control-room](https://sanity2-two.vercel.app/control-room)
* 🎨 **Sanity Studio CMS:** [https://sanity2-two.vercel.app/studio](https://sanity2-two.vercel.app/studio)
* 💻 **GitHub Repository:** [github.com/Ayushgupta1715/sanity-museum](https://github.com/Ayushgupta1715/sanity-museum)
* 📡 **Public Sanity API Query:** [Explore Public Dataset](https://iidfd4sp.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "exhibit"])
* 🎬 **Demo Video Walkthrough:** [YouTube: The Living Museum Tour (1-Min)](https://youtu.be/uMhCVwAp6Hk)

---

## 🏛️ What I Built

**The Living Museum** is a walkable 3D spatial archive where exhibits are rendered dynamically from the Sanity Content Lake into an interactive Three.js environment.

The museum is structured into four sequential, thematic chambers:

| Chamber | Theme | Core Exhibits & Experience |
| :--- | :--- | :--- |
| **Room 1: Inventions** | Human Breakthroughs | The Wheel, Printing Press, Steam Engine, Telephone, Internet. |
| **Room 2: Art** | Visual & Cultural Heritage | Classical Greek sculptures, indigenous folk crafts, traditional Indian art, and digital installations. |
| **Room 3: History** | Computing & Milestones | Mechanical calculators, early vacuum-tube computers, Apollo telemetry, and the digital epoch. |
| **Room 4: Future** | Frontier Horizons | Neural networks, quantum computing cores, interstellar probes, and autonomous systems. |

### The Data Flow Architecture

I didn't want to just copy museum text into a CMS and render cards. The goal was to make Sanity the spatial operating system of the 3D world:

```text
       +-----------------------------------------------+
       |             Sanity Content Lake               |
       |  (Schemas, 3D Coordinates, Vitality, State)   |
       +-----------------------+-----------------------+
                               |
               GROQ Query & Asset Pipelines
                               |
                               v
       +-----------------------------------------------+
       |             Next.js 16 (App Router)           |
       |         Turbopack + React 19 Client           |
       +-------+-------------------------------+-------+
               |                               |
               v                               v
    +----------------------+       +-----------------------+
    | Three.js WebGL Engine|       | React UI Overlay      |
    | - Dynamic Pedestals  |       | - 4-Button D-Pad Walk |
    | - Lighting & Shadows |       | - Interactive Modal   |
    | - Camera Raycasting  |       | - Dark Mode Ambient   |
    | - Spatial Proximity  |       | - Chamber Fast Travel |
    +----------------------+       +-----------------------+
               ^                               ^
               |                               |
               +---------------+---------------+
                               |
                               v
            +------------------------------------+
            |    Mission Control Telemetry Room  |
            |  (/control-room) - Live Lifecycle  |
            |   ACTIVE -> COOLING -> ARCHIVED    |
            +------------------------------------+
```

* **Three.js** renders the physical architecture, spatial lighting, and responsive meshes.
* **Sanity** tells the world what belongs where, how bright it shines, its coordinates in 3D space, and its lifecycle health.
* **Next.js** bridges the two with zero-latency state synchronization.

---

## 🎮 Demo

A visit to The Living Museum is tactile, atmospheric, and immediate:

1. **Enter the Grand Hall:** Spawn directly into *Room 1 (Inventions)* with ambient daylight filtering through the skylight.
2. **Explore Naturally:** Walk using keyboard controls (**W-A-S-D**) or touch/click the **4-Button Directional D-Pad** (Up, Down, Left, Right) to glide through the corridor.
3. **Target an Artifact:** Click directly on any glowing pedestal or artifact (like the *Steam Engine* or *The Wheel*).
4. **Curatorial Inspection:** An elegant inspection modal opens, pausing movement and rendering high-resolution imagery, historical provenance, creator records, and real-time vitality scores from Sanity.
5. **Atmospheric Night Mode:** Toggle the moon icon in the navigation bar to watch daylight dissolve into a deep nocturnal sanctuary with focused exhibit spotlights.
6. **Chamber Teleportation:** Use the chamber selector to jump instantly across *Art*, *History*, and the *Future*.
7. **Mission Control:** Navigate to `/control-room` to inspect real-time exhibit telemetry, adjust vitality scores, and trigger revival protocols.

### 🎥 1-Minute Walkthrough Video

{% youtube uMhCVwAp6Hk %}

---

## 📸 Inside The Living Museum

### 1. Inspecting the Steam Engine (Interactive Modal)
*Clicking an exhibit brings up its full historical documentation, creator metadata, and live Sanity lifecycle telemetry.*

![Steam Engine Modal](https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/user_shot_01_modal.png)

---

### 2. Walking Through Room 2 (The Art Gallery)
*Smooth 60 FPS navigation through classical sculptures, Indian folk crafts, and visual arts.*

![Art Gallery Walking](https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/user_shot_02_walk_rooms.png)

---

### 3. Atmospheric Night Mode
*One-click lighting transition shifts the ambiance into a dramatic after-hours museum tour.*

![Night Mode](https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/user_shot_03_night_mode.png)

---

### 4. Mission Control Room & Telemetry Editor
*Our custom in-world spatial level editor for inspecting vitality indices and lifecycle status.*

![Mission Control Room](https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/screenshot_08_control_room.png)

---

### 5. Sanity Studio CMS as the World Engine
*The native Sanity Studio embedded at `/studio`, controlling the 40+ museum records.*

![Sanity Studio](https://raw.githubusercontent.com/Ayushgupta1715/sanity-museum/master/screenshot_09_sanity_studio.png)

---

## 💻 Code

The entire codebase is open-source:

{% embed https://github.com/Ayushgupta1715/sanity-museum %}

### The Core Technology Stack:
* **Next.js 16.3.8** (App Router & Turbopack)
* **React 19 & TypeScript**
* **Three.js & OrbitControls** (WebGL rendering & raycasting)
* **Sanity Content Lake** (`@sanity/client`, `next-sanity`, `@sanity/image-url`)
* **Sanity Studio v3** (Embedded at `/studio`)
* **Tailwind CSS & Lucide Icons** (Futuristic Glassmorphic UI)
* **Vercel** (Global Edge Deployment)

---

## 🛠️ Building The Living Museum: The Vibe-Coding Odyssey

This project was built during an intensive vibe-coding sprint with **Google Antigravity** and autonomous agentic pair-programming.

The project didn't emerge from one magic prompt. It evolved through intense trial, architectural pivots, hilarious AI hallucinations, and deep technical course corrections.

Here is what really happened behind the scenes:

### 1. It Started as a Simple Artifact Viewer
The original idea was modest: a standard Next.js gallery app with Sanity as the backend. You would select a tag (e.g., "Invention"), and cards would slide in with nice CSS animations.

It was clean. It was functional.
**And it was utterly boring.**

Why participate in *Path Two: Vibe-Code Something Strange* if you're just going to build another card grid?

I wanted physical presence. I wanted to walk up to an idea. I prompted the agent:
> *"Delete the grid. Turn the viewport into a 3D hall using Three.js. Each document from Sanity must become a physical pedestal with an artifact floating above it."*

Within minutes, the first 3D room appeared. And that's when the real madness began.

---

### 2. From Flat Grids to a Physical World: The 4 Rooms
Once the 3D canvas was live, we realized that dumping 40 exhibits into one massive room was visually chaotic. Everything fought for attention, and performance cratered.

We needed spatial hierarchy.
We grouped the exhibits into **Four Distinct Chambers**:
1. **Inventions** ($X = -20 \text{ to } 0$)
2. **Art** ($X = 10 \text{ to } 30$)
3. **History** ($X = 40 \text{ to } 60$)
4. **Future** ($X = 70 \text{ to } 90$)

By assigning continuous coordinate spaces along the Z and X axes, visitors could either physically walk between eras or click the room selector to glide smoothly across centuries.

---

### 3. The AI Was Useful — and Confidently Wrong
Vibe-coding with AI agents is incredible, but models can be confidently, hilariously wrong in 3D space:

* **The Upside-Down Pedestal Incident:** Early on, I asked the agent to add spotlights to each exhibit. Instead of pointing spotlights down from the ceiling at the pedestals, the agent positioned the lights at $Y = -10$ pointing *upwards through the floor*. The pedestals appeared pitch-black, but the ceiling was radiating like a supernova.
* **The Infinity Void Bug:** When implementing the camera reset logic, the agent set the camera's Z target to `undefined` during a transition. The camera immediately accelerated into infinite black space at warp speed. I had to reload the browser just to find Earth again.
* **The Invisible Walls:** I asked the agent to prevent the player from walking through walls. The agent dutifully added collision meshes — but accidentally rendered them as solid magenta blocks that completely encased the player in a box.

**The Course Correction:** We created strict modular boundaries: Three.js math and camera bounds were isolated inside `MuseumScene.tsx`, while React handled UI overlays and Sanity subscriptions.

---

### 4. Taming Movement: The 4-Button Directional D-Pad
Desktop users love WASD keyboard movement, but casual visitors and mobile testers struggled.

Keyboards don't work on iPads or touchscreens, and relying solely on mouse dragging disoriented users who didn't understand 3D camera matrices.

We designed a floating, tactile **4-Button Directional D-Pad** (Up, Down, Left, Right). Holding down an arrow smoothly translates the camera forward, backward, or strafes left and right with cinematic damping.

Suddenly, anyone could walk through the museum with one hand.

---

### 5. The Vercel & Turbopack Crucible
Deploying a bleeding-edge WebGL app with Next.js 16 and Sanity Studio was a gauntlet:

1. **Next.js 16 Security Check:** Vercel threw a hard deployment error blocking older Next.js 16 release candidates due to upstream security advisories. We upgraded dependencies to Next.js `16.3.8` to satisfy deployment health checks.
2. **Strict `@sanity/ui` Type Mismatches:** During Turbopack's production build, `<Badge tone="...">` from `@sanity/ui` triggered strict TypeScript errors because the tone prop was typed as an internal enum. We replaced the heavy external UI badge with a lightweight, zero-dependency Tailwind badge.
3. **CORS Restrictions:** Sanity Studio embedded at `/studio` initially failed to load datasets due to browser CORS policies. We ran `npx sanity cors add "https://*.vercel.app" --credentials` to whitelist the production deployment with full authentication tokens.

---

### 6. Teaching Sanity to Remember Life, Death, and Vitality
This became the philosophical core of our submission.

In a normal CMS, content is static text: a title, a slug, a body paragraph.
In **The Living Museum**, an exhibit is a living organism.

We extended the Sanity schema with a custom telemetry object:
```typescript
{
  name: 'control',
  type: 'object',
  title: 'Museum Telemetry',
  fields: [
    {
      name: 'lifecycle',
      type: 'string',
      title: 'Lifecycle Status',
      options: { list: ['ACTIVE', 'COOLING', 'ARCHIVED', 'REVIVED'] }
    },
    {
      name: 'vitality',
      type: 'number',
      title: 'Vitality Index (0 - 100)'
    },
    { name: 'x', type: 'number', title: 'Spatial X Coordinate' },
    { name: 'y', type: 'number', title: 'Spatial Y Coordinate' },
    { name: 'z', type: 'number', title: 'Spatial Z Coordinate' }
  ]
}
```

* If an exhibit's vitality drops below 20, its pedestal light dims and pulses amber (`COOLING`).
* If it reaches 0, the artifact enters the `ARCHIVED` state.
* Curators can trigger a revival protocol, injecting vitality back into the document via Sanity patches.

Sanity isn't just serving content — **it’s running the world’s heartbeat.**

---

### 7. Building Our Own Spatial Editor: The Mission Control Room
Changing coordinates in code and redeploying was too slow.

We built `/control-room`: a dedicated Mission Control dashboard inside the application.

Curators can view all 40 exhibits across all 4 rooms, filter by lifecycle state, adjust vitality sliders in real time, and trigger instant revivals.

Every change patches the Sanity Content Lake, which in turn immediately changes the pedestal illumination in the 3D scene.

---

## 📊 Sanity Project Details

The entire museum is grounded in our public Sanity Content Lake:

* **Project ID:** `iidfd4sp`
* **Dataset:** `production`
* **Public Endpoint:**
  ```text
  https://iidfd4sp.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "exhibit"]
  ```

### The Primary GROQ Query
Here is the real-time query used to populate the 3D museum:

```groq
*[_type == "exhibit"] | order(_createdAt asc) {
  _id,
  name,
  category,
  creator,
  era,
  description,
  "imageUrl": image.asset->url,
  "control": {
    "lifecycle": coalesce(control.lifecycle, "ACTIVE"),
    "vitality": coalesce(control.vitality, 100),
    "x": control.x,
    "y": control.y,
    "z": control.z
  }
}
```

---

## 🤖 Agent Session & Methodology

* **Environment:** Google Antigravity Agentic IDE
* **Model Engine:** Gemini 2.5 Flash / Pro
* **Session Workflow:**
  * Architecture scaffolding & Next.js 16 integration.
  * Three.js procedural geometry & lighting algorithms.
  * Sanity Content Lake dataset seeding via automated scripts (`upload_to_sanity.js`).
  * Headless browser testing & live screen validation using Playwright.
  * Video generation & narration synthesis via FFmpeg and AI voiceover engines.

All transcripts and agent interactions were logged and preserved in the repository history under `/docs/agent-sessions`.

---

## 🌌 Final Thoughts

Participating in **Path Two: Vibe-Code Something Strange** made me rethink what the web could look like over the next decade.

For twenty years, the web has been dominated by 2D document pages. But as GPUs, WebGL, and generative AI converge, structured data no longer needs to be trapped inside a flat grid.

When you pair an agile content engine like **Sanity** with a spatial rendering layer like **Three.js**, content stops being text on a screen.

**It becomes a place you can walk through.**

---

### 💬 Let's Discuss!
* What historical artifact or technological milestone would you add to Room 4?
* Have you experimented with using Sanity for spatial coordinates or game state?

**Drop your questions, thoughts, or feedback in the comments below!** Let's push the boundaries of what structured content can do. 🚀
