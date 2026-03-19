import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import PAD_CHORDS from "./chords.js";

const SYNTH_CONFIGS = {
  bright: {
    oscillator: { type: "triangle8" },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 1.2 },
    volume: -14,
  },
  warm: {
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.5, sustain: 0.4, release: 2 },
    volume: -12,
  },
  dark: {
    oscillator: { type: "sawtooth8" },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0.15, release: 0.8 },
    volume: -16,
  },
  ethereal: {
    oscillator: { type: "sine4" },
    envelope: { attack: 0.3, decay: 0.8, sustain: 0.6, release: 3 },
    volume: -13,
  },
  dreamy: {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.5, decay: 1, sustain: 0.5, release: 4 },
    volume: -14,
  },
};

export default function MoodMusic({ mood, isPlaying, onToggle }) {
  const synthRef = useRef(null);
  const padRef = useRef(null);
  const seqRef = useRef(null);
  const padLoopRef = useRef(null);
  const noiseRef = useRef(null);
  const effectsRef = useRef([]);
  const animFrameRef = useRef(null);
  const [visualBars, setVisualBars] = useState(Array(20).fill(0));

  const cleanup = useCallback(() => {
    if (seqRef.current) { seqRef.current.stop(); seqRef.current.dispose(); seqRef.current = null; }
    if (padLoopRef.current) { padLoopRef.current.stop(); padLoopRef.current.dispose(); padLoopRef.current = null; }
    if (synthRef.current) { synthRef.current.dispose(); synthRef.current = null; }
    if (padRef.current) { padRef.current.dispose(); padRef.current = null; }
    if (noiseRef.current) { noiseRef.current.stop(); noiseRef.current.dispose(); noiseRef.current = null; }
    effectsRef.current.forEach((e) => { try { e.dispose(); } catch (_) {} });
    effectsRef.current = [];
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    try { Tone.getTransport().stop(); Tone.getTransport().cancel(); } catch (_) {}
  }, []);

  useEffect(() => { return cleanup; }, [cleanup]);

  useEffect(() => {
    if (!isPlaying) { cleanup(); setVisualBars(Array(20).fill(0)); return; }

    const init = async () => {
      await Tone.start();
      cleanup();

      const cfg = mood.musicConfig;
      Tone.getTransport().bpm.value = cfg.tempo;

      const reverb = new Tone.Reverb({ decay: 4.5, wet: 0.5 }).toDestination();
      const delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.28, wet: 0.2 }).connect(reverb);
      effectsRef.current.push(reverb, delay);

      const preset = SYNTH_CONFIGS[cfg.synthType] || SYNTH_CONFIGS.warm;
      const synth = new Tone.PolySynth(Tone.Synth, preset).connect(delay);
      synthRef.current = synth;

      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 4 },
        volume: -20,
      }).connect(reverb);
      padRef.current = padSynth;

      const autoFilter = new Tone.AutoFilter({ frequency: "2m", baseFrequency: 200, octaves: 2.5 }).connect(reverb).start();
      effectsRef.current.push(autoFilter);
      const noise = new Tone.Noise({ type: "pink", volume: -34 }).connect(autoFilter);
      noise.start();
      noiseRef.current = noise;

      const pattern = Array.from({ length: 16 }, () =>
        Math.random() < 0.42 ? cfg.notes[Math.floor(Math.random() * cfg.notes.length)] : null
      );

      const seq = new Tone.Sequence((time, note) => {
        if (note) synth.triggerAttackRelease(note, "8n", time, 0.25 + Math.random() * 0.4);
      }, pattern, "8n");
      seq.loop = true;
      seqRef.current = seq;

      let padIdx = 0;
      const padLoop = new Tone.Loop((time) => {
        const chordName = cfg.pad[padIdx % cfg.pad.length];
        const notes = PAD_CHORDS[chordName] || ["C3", "E3", "G3"];
        padSynth.triggerAttackRelease(notes, "2n", time, 0.3);
        padIdx++;
      }, "1m");
      padLoopRef.current = padLoop;

      seq.start(0);
      padLoop.start(0);
      Tone.getTransport().start();

      const animateBars = () => {
        setVisualBars((prev) => prev.map((v) => v + (Math.random() * 0.8 + 0.1 - v) * 0.16));
        animFrameRef.current = requestAnimationFrame(animateBars);
      };
      animateBars();
    };

    init();
  }, [isPlaying, mood, cleanup]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <button onClick={onToggle} style={{
        cursor: "pointer", border: `2px solid ${mood.color}40`,
        background: isPlaying ? mood.color : "rgba(255,255,255,0.5)",
        backdropFilter: "blur(8px)", color: isPlaying ? "#fff" : "#2A2520",
        padding: "14px 32px", borderRadius: 40, fontFamily: "'Nunito', sans-serif",
        fontWeight: 700, fontSize: 15, transition: "all 0.3s ease",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {isPlaying ? "⏸" : "▶"} {isPlaying ? "Pause Soundscape" : "Play Soundscape"}
      </button>

      {isPlaying && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48, justifyContent: "center" }}>
          {visualBars.map((v, i) => (
            <div key={i} style={{
              width: 5, borderRadius: 3,
              height: `${Math.max(4, v * 46)}px`,
              background: `${mood.color}${["CC", "99", "DD", "88", "BB"][i % 5]}`,
              transition: "height 0.1s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
