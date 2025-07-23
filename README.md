# 🗺️ Sidequest App  
**Complete Project Documentation**

Sidequest is an adventure-generating app that crafts meaningful, real-world quests based on user preferences, external data, and curated content blocks. It’s a tool for spontaneity, exploration, and transformation.

---

## 🧭 User Input Phase

Users select from the following options:

### ⏱️ Timeframe
- **Quick Adventure** – under an hour  
- **Afternoon Quest** – a few hours  
- **Day Journey** – full-day commitment  
- **Epic Saga** – multi-day adventure  

### ⚔️ Difficulty
- Easy  
- Medium  
- Hard  

### 🚗 Transportation
- **Has car** – access to personal vehicle  
- **No car** – walking/public transportation only  

### 🎭 Theme/Mode (optional)
- **Journey** – focus on travel/exploration  
- **Life-changing** – long-term impact quests  
- **The Playbook** – romance-oriented  
- **Virtuous** – volunteering and helping others  

---

## ⚙️ Quest Generation System

Quests are built using:
- A database of **quest blocks** ("seeds")  
- User inputs (time, difficulty, transport, theme)  
- **Location data** (via IP, user input, or Google Maps API)  
- **External APIs** for real-time data:
  - Atlas Obscura (unique sites)  
  - Google Places / Maps / Explore  
  - OpenWeather API  
  - Spotify API (music tasks)  
  - Airbnb Experiences  
  - Amtrak / Megabus / Greyhound APIs  
  - RSS feeds from local travel blogs  
- **AI Integration** (Claude, Gemini, etc.) to create coherent quest narratives

---

## 🎲 Quest Block Types

| Type        | Examples                                      |
|-------------|-----------------------------------------------|
| `[physical]` | Do a flip, learn to skateboard, frolicking    |
| `[obtain]`   | Pistachio ice cream, thrifted sword            |
| `[create]`   | Origami crane, slam poem, found-sound album   |
| `[location]` | Rooftop, sunset spot, Atlas Obscura site      |
| `[learn]`    | Solve a Rubik’s cube, new dance, rage-baiting |
| `[perform]`  | Sing in public, slow dance, poetry reading    |
| `[costume]`  | Formal wear, themed outfit, something odd     |

---

## 🧪 Quest Interface

### 🛡️ Pre-Quest Screen
- ⚠️ Safety disclaimer: *"Be careful and don't be stupid."*  
- Quest description (AI-generated)  
- Warning: *"Timer cannot be paused. Good luck."*  
- `{QUEST BUTTON}` to begin

### ⏳ Active Quest Screen
- Live countdown timer  
- Quest details  
- Action buttons:  
  - `[DIRECTIONS]` → Navigation  
  - `[QUIT QUEST]` → Forfeit (point penalty)  

**Note:** No “complete” button — quests run full duration

---

## 🏆 Point System

### 📈 Completion Points
- Easy: **10 pts**  
- Medium: **25 pts**  
- Hard: **50 pts**  
- Daily Quest Bonus (optional)

### ⏱️ Time Bonuses
- >50% time remaining: +10 pts  
- >75% time remaining: +20 pts  

### 🎭 Theme Multipliers
- Journey: 1.5×  
- Life-changing: 2×  
- The Playbook: 1.25×  
- Virtuous: 1.5×  

### ❌ Penalties
- Quit: -5 pts  
- Timeout: 0 pts (no extra penalty)  

### 🔁 Streaks
- Consecutive completions increase multipliers

---

## 🏗️ Technical Architecture

### Frontend
- Framework: React / Vue / Next.js  
- Components: Quest cards, timer, nav, point UI  
- State: Quest state, user profile, points, streak  
- Design: Mobile-first, responsive  

### Quest Generation Pipeline
1. Pull matching blocks from DB  
2. Query external APIs (location, weather, events)  
3. Calculate quest time:
   - Travel time (Google Maps API)  
   - Action time (from DB) + 10% buffer  
4. Generate narrative using AI  
5. Cache quest data for offline use  

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
