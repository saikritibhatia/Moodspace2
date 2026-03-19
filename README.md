# 🌿 MoodSpace

**AI-powered mental wellness through movement, music & art therapy.**

Select a mood emoji → get personalized movement exercises, a generative ambient soundscape, and art therapy prompts — all powered by Claude AI and Tone.js.

## Features

- 9 mood states with unique color themes and gradients
- AI-generated movement therapy (3 exercises per mood)
- Generative ambient music via Tone.js (unique key, tempo, synth per mood)
- AI-generated art therapy prompts with reflection questions
- Guided listening meditation and journaling prompts
- Glassmorphism UI with floating particles

## AI Stack

| Layer | Technology |
|---|---|
| Generative AI | Claude Sonnet 4 (Anthropic API) |
| Music Engine | Tone.js |
| Frontend | React 18 + Vite |
| Design | DM Serif Display + Nunito, custom glassmorphism |

## Run Locally
```bash
npm install
npm run dev
```

## License

MIT
```

---

**Final structure on GitHub:**
```
your-repo/
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── index.jsx
    ├── App.jsx
    ├── MoodMusic.jsx
    ├── api.js
    ├── moods.js
    └── chords.js
