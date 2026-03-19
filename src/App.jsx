import { useState, useEffect, useRef } from "react";
import MOODS from "./moods.js";
import MoodMusic from "./MoodMusic.jsx";
import { fetchMoodWellness } from "./api.js";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;600;700&display=swap";

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("movement");
  const [fadeIn, setFadeIn] = useState(false);
  const [particles, setParticles] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = FONT_URL; link.rel = "stylesheet"; document.head.appendChild(link);
    setTimeout(() => setFadeIn(true), 100);
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 6 + 2, duration: Math.random() * 8 + 6, delay: Math.random() * 4,
      }))
    );
  }, []);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood); setLoading(true); setError(null);
    setAiResult(null); setActiveTab("movement"); setMusicPlaying(false);

    try {
      const result = await fetchMoodWellness(mood);
      setAiResult(result);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (err) {
      console.error(err);
      setError("Couldn't connect to the AI. Please try again.");
    } finally { setLoading(false); }
  };

  const accent = selectedMood ? selectedMood.color : "#B8A898";

  return (
    <div style={{
      minHeight: "100vh",
      background: selectedMood ? selectedMood.bg : "linear-gradient(135deg, #F0EDE6 0%, #E8E2D8 50%, #DDD5C8 100%)",
      transition: "background 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden",
    }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "fixed", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: selectedMood ? `${selectedMood.color}30` : "#B8A89830",
          animation: `floatP ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          pointerEvents: "none", transition: "background 1s ease",
        }} />
      ))}

      <style>{`
        @keyframes floatP { 0% { transform: translateY(0) translateX(0) scale(1); } 100% { transform: translateY(-40px) translateX(20px) scale(1.4); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .mbtn { cursor:pointer; border:none; background:rgba(255,255,255,0.55); backdrop-filter:blur(12px); border-radius:24px; padding:16px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1); width:100px; box-shadow:0 4px 20px rgba(0,0,0,0.04); }
        .mbtn:hover { transform:translateY(-8px) scale(1.05); background:rgba(255,255,255,0.85); box-shadow:0 12px 40px rgba(0,0,0,0.1); }
        .mbtn.sel { background:rgba(255,255,255,0.9); transform:translateY(-4px) scale(1.02); box-shadow:0 8px 30px rgba(0,0,0,0.12); }
        .tbtn { cursor:pointer; border:none; padding:12px 24px; border-radius:40px; font-family:'Nunito',sans-serif; font-weight:700; font-size:14px; transition:all 0.3s ease; letter-spacing:0.5px; white-space:nowrap; }
        .crd { background:rgba(255,255,255,0.6); backdrop-filter:blur(16px); border-radius:20px; padding:28px; box-shadow:0 8px 32px rgba(0,0,0,0.06); transition:all 0.3s ease; border:1px solid rgba(255,255,255,0.5); }
        .crd:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.1); }
      `}</style>

      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px",
        position: "relative", zIndex: 1,
        opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 8, animation: "breathe 4s ease-in-out infinite", display: "inline-block" }}>🌿</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 6vw, 52px)", fontWeight: 400, color: "#2A2520", margin: "0 0 12px", letterSpacing: "-1px" }}>MoodSpace</h1>
          <p style={{ fontSize: 17, color: "#5A5148", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Your mood is a compass. Select how you're feeling, and let AI guide you toward movement, music, and art that meet you where you are.
          </p>
        </div>

        {/* Mood Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          {MOODS.map((mood, i) => (
            <button key={mood.label}
              className={`mbtn ${selectedMood?.label === mood.label ? "sel" : ""}`}
              onClick={() => handleMoodSelect(mood)} disabled={loading}
              style={{
                animation: `fadeUp 0.6s ease ${i * 0.06}s both`,
                border: selectedMood?.label === mood.label ? `2px solid ${mood.color}` : "2px solid transparent",
              }}>
              <span style={{ fontSize: 36, lineHeight: 1 }}>{mood.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", color: selectedMood?.label === mood.label ? mood.color : "#5A5148", transition: "color 0.3s" }}>{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ width: 48, height: 48, border: `3px solid ${accent}20`, borderTop: `3px solid ${accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2A2520", margin: "0 0 8px" }}>Crafting your wellness path…</p>
            <p style={{ fontSize: 14, color: "#7A7168" }}>AI is personalizing movement, music & art for your mood</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: 40, animation: "fadeUp 0.5s ease both" }}>
            <div className="crd" style={{ display: "inline-block", maxWidth: 400 }}>
              <p style={{ fontSize: 32, margin: "0 0 12px" }}>🌧️</p>
              <p style={{ color: "#5A5148", margin: "0 0 16px" }}>{error}</p>
              <button onClick={() => handleMoodSelect(selectedMood)} style={{ cursor: "pointer", border: "none", background: accent, color: "#fff", padding: "12px 28px", borderRadius: 40, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14 }}>Try Again</button>
            </div>
          </div>
        )}

        {/* Results */}
        {aiResult && !loading && (
          <div ref={resultRef} style={{ animation: "fadeUp 0.7s ease both" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Your {selectedMood?.label} Wellness Path</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#2A2520", margin: 0 }}>
                {activeTab === "movement" ? aiResult.movement.title : activeTab === "art" ? aiResult.art.title : aiResult.music?.title || "Your Soundscape"}
              </h2>
              <p style={{ fontSize: 15, color: "#5A5148", margin: "8px auto 0", maxWidth: 500, lineHeight: 1.6 }}>
                {activeTab === "movement" ? aiResult.movement.description : activeTab === "art" ? aiResult.art.description : aiResult.music?.description || ""}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
              {[{ id: "movement", icon: "🏃", l: "Movement" }, { id: "music", icon: "🎵", l: "Music" }, { id: "art", icon: "🎨", l: "Art Therapy" }].map((t) => (
                <button key={t.id} className="tbtn" onClick={() => setActiveTab(t.id)} style={{
                  background: activeTab === t.id ? accent : "rgba(255,255,255,0.5)",
                  color: activeTab === t.id ? "#fff" : "#5A5148", backdropFilter: "blur(8px)",
                }}>{t.icon} {t.l}</button>
              ))}
            </div>

            {/* Movement Tab */}
            {activeTab === "movement" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {aiResult.movement.exercises.map((ex, i) => (
                  <div key={i} className="crd" style={{ animation: `fadeUp 0.5s ease ${i * 0.12}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: accent, flexShrink: 0 }}>{i + 1}</div>
                      <div>
                        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, fontWeight: 400, color: "#2A2520", margin: 0 }}>{ex.name}</h3>
                        <span style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px" }}>{ex.duration}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 15, color: "#4A4238", lineHeight: 1.7, margin: "0 0 12px" }}>{ex.instruction}</p>
                    <div style={{ background: `${accent}10`, borderRadius: 12, padding: "10px 16px", borderLeft: `3px solid ${accent}40` }}>
                      <p style={{ fontSize: 13, color: "#5A5148", margin: 0, fontStyle: "italic" }}>✨ {ex.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Music Tab */}
            {activeTab === "music" && (
              <div style={{ animation: "fadeUp 0.5s ease both" }}>
                <div className="crd" style={{ textAlign: "center", padding: "40px 28px" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎧</div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2A2520", margin: "0 0 8px" }}>Generative Ambient Soundscape</h3>
                  <p style={{ fontSize: 13, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 24px" }}>
                    {selectedMood.musicConfig.key} · {selectedMood.musicConfig.tempo} BPM · {selectedMood.musicConfig.synthType}
                  </p>

                  <MoodMusic mood={selectedMood} isPlaying={musicPlaying} onToggle={() => setMusicPlaying(!musicPlaying)} />

                  {aiResult.music && (
                    <div style={{ marginTop: 36, textAlign: "left" }}>
                      <div style={{ background: `${accent}10`, borderRadius: 16, padding: "20px 24px", borderLeft: `3px solid ${accent}40`, marginBottom: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Guided Listening</p>
                        <p style={{ fontSize: 15, color: "#4A4238", lineHeight: 1.7, margin: 0 }}>{aiResult.music.listening_prompt}</p>
                      </div>
                      <div style={{ background: `${accent}10`, borderRadius: 16, padding: "20px 24px", borderLeft: `3px solid ${accent}40` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Journal While Listening</p>
                        <p style={{ fontSize: 15, color: "#4A4238", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>💭 {aiResult.music.journaling_prompt}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Art Tab */}
            {activeTab === "art" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {aiResult.art.activities.map((act, i) => (
                  <div key={i} className="crd" style={{ animation: `fadeUp 0.5s ease ${i * 0.12}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{["🖌️", "🎭", "✏️"][i]}</div>
                      <div>
                        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, fontWeight: 400, color: "#2A2520", margin: 0 }}>{act.name}</h3>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#7A7168" }}>{act.materials}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 15, color: "#4A4238", lineHeight: 1.7, margin: "0 0 12px" }}>{act.prompt}</p>
                    <div style={{ background: `${accent}10`, borderRadius: 12, padding: "10px 16px", borderLeft: `3px solid ${accent}40` }}>
                      <p style={{ fontSize: 13, color: "#5A5148", margin: 0, fontStyle: "italic" }}>💭 {act.reflection}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <p style={{ fontSize: 14, color: "#7A7168", marginBottom: 8 }}>Moods shift. Come back anytime.</p>
              <button onClick={() => { setSelectedMood(null); setAiResult(null); setMusicPlaying(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{
                cursor: "pointer", border: `2px solid ${accent}40`, background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(8px)", color: "#2A2520", padding: "12px 32px", borderRadius: 40,
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, transition: "all 0.3s ease",
              }}>← Choose Another Mood</button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 64, padding: "24px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 12, color: "#9A9188", margin: 0 }}>MoodSpace · AI-powered wellness through movement, music & art · Built for social good</p>
        </div>
      </div>
    </div>
  );
}
