export async function fetchMoodWellness(mood) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are MoodSpace, a compassionate wellness guide. A user is feeling "${mood.label}" ${mood.emoji}.

Return ONLY valid JSON (no markdown, no backticks, no preamble) in this exact structure:
{
  "movement": {
    "title": "A poetic 3-5 word title for the movement practice",
    "description": "A warm, 1-sentence intro to why this movement helps this mood",
    "exercises": [
      { "name": "Exercise name", "duration": "e.g. 2 minutes", "instruction": "Clear, gentle step-by-step instruction (2-3 sentences)", "benefit": "One sentence on why this helps" }
    ]
  },
  "art": {
    "title": "A poetic 3-5 word title for the art therapy",
    "description": "A warm, 1-sentence intro to why this creative practice helps this mood",
    "activities": [
      { "name": "Activity name", "materials": "Simple materials needed", "prompt": "A vivid, inspiring creative prompt (2-3 sentences)", "reflection": "A gentle question to reflect on after creating" }
    ]
  },
  "music": {
    "title": "A poetic 3-5 word title for the music therapy moment",
    "description": "A warm 1-sentence note on why this soundscape helps with this mood",
    "listening_prompt": "A 2-3 sentence guided listening meditation to do while ambient music plays — breathing, feeling, presence",
    "journaling_prompt": "A reflective question to write about while listening"
  }
}

Give exactly 3 exercises and 3 art activities. Warm, poetic, empowering — never clinical. Tailor deeply to "${mood.label}". Music section complements an ambient generative soundscape in ${mood.musicConfig.key} at ${mood.musicConfig.tempo} BPM.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("");

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
