Sidequest App - Complete Project Documentation
Overview
App Name: Sidequest
Purpose: Create an app focused on real, meaningful experiences rather than the glorification of small moments. A "sidequest" is an opportunity to engage in experiences one usually wouldn't do and share with other people.
Design Philosophy:
Tone: Minimalistic, mystical, and warm
Mission: Combat social media superficiality by creating authentic, memorable experiences
Approach: Push people outside comfort zones in playful, creative ways
Core Functionality
User Input Phase
Users select:
Timeframe Options:
"Quick Adventure" (under an hour)
"Afternoon Quest" (a few hours)
"Day Journey" (full day commitment)
"Epic Saga" (multi-day adventure)
Difficulty: Easy, Medium, Hard
Transportation Available:
Has car - access to vehicle
No car - relies on public transport/walking
Theme/Mode (optional):
Journey - focus on travel
Life-changing - long-term commitments and changes
The Playbook - romantic actions and settings
Virtuous - helping others/volunteering

Quest Generation System
The app generates quests using:
Database of "blocks" (seeds) that serve as quest building blocks
User inputs (timeframe, difficulty, transportation, theme)
Location data from IP address/user input/Google Maps API
External APIs for real-time data:
Atlas Obscura (unique locations)
Google Places/Maps/Explore APIs
Weather APIs (OpenWeather)
Spotify API (music challenges)
Airbnb Experiences
Transportation APIs (Amtrak, Greyhound, Megabus)
Local travel blogs via RSS
AI Integration (Claude or Gemini) to combine elements into coherent quests
Quest Block Types
[physical] - Physical actions
Do a flip
Learn to skateboard
Frolicking
[obtain] - Acquire something
Pistachio ice cream
Sword from a list
Thrifted clothes
[create] - Make something
Origami crane
Slam poem
Album inspired by random song
[location] - Visit specific place
Top of parking garage
Sunrise/sunset viewing spot
Atlas Obscura location
[learn] - Acquire new skill
Solve Rubik's cube
Art of rage-baiting
New dance
[perform] - Artistic performance
Sing in public
Slow dance
Perform slam poem
[costume] - Wear something specific
Formal wear
Unusual outfit
Themed clothing
Quest Interface
Pre-Quest Screen:
Safety disclaimer: "Be careful and don't be stupid"
Quest description (AI-generated paragraph)
Warning: "Timer cannot be paused. Good luck."
{QUEST BUTTON}
Active Quest Screen:
Active Timer: Countdown showing time remaining
Quest Description: Full quest details
Action Buttons:
[DIRECTIONS] - Opens maps/navigation
[QUIT QUEST] - Abandon quest (point deduction)
Note: No "complete" button - timer runs full duration
Point System
Quest Completion:
Easy quest: 10 points
Medium quest: 25 points
Hard quest: 50 points
AP Daily Quest?
Time Bonuses:
Complete with >50% time remaining: +10 points
Complete with >75% time remaining: +20 points
Theme Multipliers:
Journey mode: 1.5x points
Life-changing mode: 2x points
The Playbook: 1.25x points
Virtuous mode: 1.5x points
Penalties:
Quit quest: -5 points
Time expired: 0 points (no penalty)
Streak Bonuses: Consecutive completions multiply points
Technical Architecture
Frontend
Framework: React (or Vue.js/Next.js)
Components: Quest cards, timer, navigation, point display
State Management: Active quests, user profile, points, streaks
Design: Mobile-first responsive design
Quest Generation Pipeline
Pull relevant blocks from database based on inputs
Query APIs for location/weather/event data
Calculate time requirements:
Travel time (from Google Maps API)
Action time (from database)
Total = (Travel + Action) + 10% buffer
Send combined data to AI service
AI returns formatted quest paragraph
Cache for offline functionality
AI Quest Generation Prompt
SIDEQUEST GENERATION PROMPT

You are the quest generator for Sidequest, an app that creates meaningful real-world adventures. Your task is to combine quest blocks into a single, cohesive experience that pushes people outside their comfort zones.


Offline Functionality
Pre-generate template quests with fill-in-the-blanks
Store in local storage for no-connection scenarios
Sync completed quests when connection restored
Database Structure (Google Sheets)
Sheet 1: Quest Blocks
Column
Field Name
Description
A
Block_ID
Unique identifier (e.g., BLK_001)
B
Block_Type
[physical], [obtain], [create], [location], [learn], [perform], [costume]
C
Action_Description
Specific action to perform
D
Time_Required
Minutes needed to complete
E
Difficulty_Tag
easy, medium, hard
F
Location_Dependent
YES/NO
G
Transportation_Required
car_required, car_optional, no_car_needed
H
Weather_Modifier
all_weather, no_rain, daylight_only, clear_skies
I
Theme_Tags
romantic, life_changing, journey, virtuous, general
J
Cost_Estimate
0, 5-10, 10-25, 25+
K
Indoor_Outdoor
indoor, outdoor, both
L
Social_Level
solo, optional_social, requires_others
M
Equipment_Needed
none, smartphone, formal_wear, etc.
N
Time_of_Day
anytime, business_hours, daylight, night_only
O
Physical_Intensity
low, moderate, high
P
Combination_Priority
high, medium, low
Q
Special_Notes
Additional constraints

Sheet 2: Location Seeds
Column
Field Name
Description
A
Location_ID
Unique identifier
B
Location_Type
parking_garage, park, museum, rooftop
C
Specific_Examples
Real places to pull from APIs
D
Weather_Sensitivity
high, medium, low
E
Public_Access
always_open, business_hours, varies
F
Theme_Compatibility
romantic, journey, life_changing, general

Sheet 3: Combination Rules
Column
Field Name
Description
A
Rule_ID
Unique identifier
B
Block_Type_1
First block type
C
Block_Type_2
Second block type
D
Synergy_Score
How well they combine (1-10)
E
Example_Combination
Sample quest idea

Sheet 4: User Submissions
Column
Field Name
Description
A
Submission_Date
When submitted
B
User_Email
Contact (optional)
C
Block_Type
Suggested category
D
Action_Idea
Their suggestion
E
Why_Meaningful
Their reasoning
F
Status
pending, approved, rejected
G
Admin_Notes
Review comments


Chunks (New)

In Journey mode specifically, we will implement what are called Chunks. Chunks are specific subsets of quests that are linked to a unique API/algorithm that generates a certain activity. For example, the first chunks on the website were the AtlasObscura API and the OpenStreetMap API; these chunks will be “obscure” and “hiking” respectively. More chunk ideas can include:

Birding
Boat rental
Canoeing
Caving
Camping
Gold Panning
Hiking/Trails/Trails Difficult
Wild Horse Viewing
Whitewater rafting…

Each of these chunks will pull from unique sources specific to them and allow for more variety in quests. Furthermore, these blocks/seeds can be tagged specifically for a certain chunk and that can personalize quests a lot more. These chunks can also be configured to only activate in certain conditions (can’t canoe in the winter/can’t pan for gold in Florida etc. sybau it’s an example). 
Example Quests
Easy Quest Example: "Visit the nearest botanical garden and create an origami flower. Leave it on a bench for the next visitor to discover—a small gift from one wanderer to another."
Medium Quest Example: "Ascend to the highest parking garage in your area and perform a flip at its peak, marking your triumph. Then, in that same elevated space between earth and sky, fold an origami crane and release it to the wind."
Hard Quest Example: "Don formal attire and travel to three different rooftops before sunset. At each peak, perform a different dance for exactly one song. Document not the dance, but the view that witnessed it."
Romantic Mode Example: "Find a quiet corner in a bookstore or library. Write a love letter to a fictional character, fold it into a paper airplane, and hide it between the pages of their story."


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
