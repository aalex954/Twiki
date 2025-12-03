# Twiki

**Educational Doom Scrolling** - A Twitter/X-style feed powered by Wikipedia knowledge and AI-generated engaging content.

![Twiki Banner](https://img.shields.io/badge/Powered%20by-Wikipedia%20%2B%20OpenAI-blue)

## Overview

Twiki transforms dry Wikipedia content into viral, shareable social media posts. It's designed to give you the addictive scrolling experience of Twitter/X, but instead of drama and hot takes, you're learning fascinating facts about science, history, space, and more.

**Healthy doom scrolling that actually teaches you something.**

## Features

### Twitter/X-Like Interface
- Dark theme matching modern social media aesthetics
- Infinite scroll for endless learning
- Like, bookmark, and share functionality
- Topic-based filtering

### Wikipedia Integration
- Fetches random articles from Wikipedia REST API
- "Trending" tab uses Wikipedia's "On This Day" historical events
- Direct links to full Wikipedia articles for deeper reading

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

### Feed Tabs

- **For You**: Random mix of fascinating topics
- **Trending**: Historical events that happened on today's date
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

### Search

Use the search bar to explore any topic you're curious about.

## Configuration

### API Settings

| Setting | Options | Description |
|---------|---------|-------------|
| OpenAI API Key | Your key | Required for generating posts |
| Model | GPT-4o Mini, GPT-4o, GPT-3.5 Turbo | Choose speed vs quality |

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

2. **OpenAI Chat Completions API**
   - Models: gpt-4o-mini, gpt-4o, gpt-3.5-turbo
   - Temperature: 0.8 (balanced creativity/accuracy)

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## Contributing

Feel free to fork and improve! Some ideas:
- Add more post styles
- Implement actual threading (multi-post threads)
- Add image generation for posts
- Create a "bookmarks" view
- Add share to actual social media

## Disclaimer

- All facts are sourced from Wikipedia and may contain inaccuracies
- AI-generated posts aim to be factually accurate but should be verified for important use
- This is an educational entertainment tool, not a primary source


