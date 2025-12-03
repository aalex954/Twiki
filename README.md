# Twiki

**Educational Doom Scrolling** - A Twitter/X-style feed powered by Wikipedia knowledge and AI-generated engaging content.

![Twiki Banner](https://img.shields.io/badge/Powered%20by-Wikipedia%20%2B%20OpenAI-blue)
[![Deploy Twiki](https://github.com/aalex954/Twiki/actions/workflows/static.yml/badge.svg)](https://github.com/aalex954/Twiki/actions/workflows/static.yml)

<img width="1209" height="774" alt="image" src="https://github.com/user-attachments/assets/955f2d6c-7d2c-401c-86d1-7cac224a16eb" />

Try It Here! : [Twiki on github.io](https://aalex954.github.io/Twiki/)

## Overview

Twiki transforms dry Wikipedia content into viral, shareable social media posts. It's designed to give you the addictive scrolling experience of Twitter/X, but instead of drama and hot takes, you're learning fascinating facts about science, history, space, and more.

**Healthy doom scrolling that actually teaches you something.**

## Features

### Twitter/X-Like Interface
- Dark theme matching modern social media aesthetics
- Infinite scroll for endless learning
- Like, bookmark, and share functionality
- Topic-based filtering
- **Fully responsive mobile design** with dedicated mobile navigation and touch-friendly UI

### Wikipedia Integration
- Fetches random articles from Wikipedia REST API
- "Trending" tab uses Wikipedia's "On This Day" historical events
- Direct links to full Wikipedia articles for deeper reading
- **200+ curated topics** spanning science, history, space, technology, philosophy, and more
- **Smart topic rotation** - tracks recently shown topics to avoid repetition
- **Related article discovery** - finds varied articles within your chosen topic

### AI-Powered Content Generation
Uses OpenAI to transform Wikipedia content into engaging posts with 10 different styles:

| Style | Description |
|-------|-------------|
| 🔥 Viral Fact | Mind-blowing facts with dramatic flair |
| 🌶️ Hot Take | Thought-provoking perspectives |
| 🧵 Thread | Hook-style thread openers |
| 😂 Meme | Humorous educational content |
| 💡 TIL | "Today I Learned" conversational facts |
| ⚖️ Comparison | Surprising size/age comparisons |
| ❓ Q&A | Rhetorical questions with answers |
| 🔍 Myth Buster | Correcting common misconceptions |
| 💬 Quote | Notable quotes and observations |
| 📅 Timeline | Historical perspective posts |

### 🎛️ Customizable Content Tone

Fine-tune your feed with four adjustable sliders:

| Setting | What it Controls |
|---------|------------------|
| 🎣 **Clickbait Level** | How sensational and attention-grabbing the headlines are |
| 🔥 **Ragebait Level** | How provocative and debate-sparking the content is |
| 😱 **Shock Factor** | How jaw-dropping and mind-blowing the revelations are |
| 🌑 **Emotional Depth** | How emotionally heavy and thought-provoking the content is |

Each slider ranges from 0-100%, letting you customize your experience from "calm educational content" to "MAXIMUM VIRAL ENERGY."

## Getting Started

### Prerequisites

- A modern web browser
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this repository
2. Open `index.html` in your browser
3. Click "API Settings" in the sidebar
4. Enter your OpenAI API key
5. Start scrolling and learning!

No build process, no dependencies, no server required. Just open and go.

## Usage

### Mobile Experience

On mobile devices, Twiki provides a native app-like experience:
- **Top header** with logo, search, and settings buttons
- **Bottom navigation bar** for quick tab switching
- **Pull down to refresh** your feed
- **Tap the search icon** to explore topics or search anything
- **Add to Home Screen** for the best experience (supported on iOS and Android)

### Feed Tabs

- **For You**: Random mix of fascinating topics from 200+ curated subjects
- **Trending**: Historical events that happened on today's date
- **Memes**: Twitter/Reddit-style shitposts with educational facts (uses 100+ relatable topics like procrastination, coffee, cats, tech struggles, etc.)
- **Random**: Completely random Wikipedia articles

### Topic Tags

Click any topic tag in the right sidebar to filter content:
- 🔬 Science
- 📜 History
- 🚀 Space
- 🦁 Animals
- 💻 Technology
- 🎨 Art
- 🎵 Music
- 🍕 Food
- ⚽ Sports
- 🤔 Philosophy
- 😂 Memes

### Search

Use the search bar to explore any topic you're curious about.

## Configuration

### API Settings

| Setting | Options | Description |
|---------|---------|-------------|
| OpenAI API Key | Your key | Required for generating posts |
| Model | GPT-5 Nano, GPT-5 Mini, GPT-5.1, GPT-4.1 Mini, GPT-4.1 | Choose speed vs quality |

### Tone Settings

All settings are saved to localStorage and persist between sessions.

## File Structure

```
Twiki/
├── index.html      # Main HTML structure
├── styles.css      # All styling (dark theme, responsive)
├── app.js          # Application logic and API calls
└── README.md       # This file
```

## Privacy & Security

- Your OpenAI API key is stored **locally** in your browser's localStorage
- No data is sent to any server except OpenAI's API for content generation
- Wikipedia API calls are made directly to Wikipedia's public REST API
- No tracking, no analytics, no cookies

## Technical Details

### APIs Used

1. **Wikipedia REST API**
   - `/page/random/summary` - Random articles
   - `/page/summary/{title}` - Article summaries
   - `/feed/onthisday/events/{MM}/{DD}` - Historical events
   - `/w/api.php?action=query&list=search` - Related article discovery

2. **OpenAI Chat Completions API**
   - Models: GPT-5 Nano, GPT-5 Mini, GPT-5.1, GPT-4.1 Mini, GPT-4.1
   - Temperature: 0.8 (standard) / 1.3 (meme mode for extra chaos)

### Mobile Support

Twiki is fully responsive with dedicated mobile optimizations:
- **Mobile Header**: Compact header with search and settings buttons
- **Bottom Navigation**: Quick access to Home, Trending, Refresh, Memes, and Random tabs
- **Search Overlay**: Full-screen search with topic suggestions
- **Touch-Friendly**: Larger tap targets and swipe-optimized interactions
- **Safe Area Support**: Properly handles notches and home indicators on modern phones
- **PWA-Ready**: Supports "Add to Home Screen" for app-like experience

## Disclaimer

- All facts are sourced from Wikipedia and may contain inaccuracies
- AI-generated posts aim to be factually accurate but should be verified for important use
- This is an educational entertainment tool, not a primary source


