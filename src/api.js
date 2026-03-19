export async function fetchMoodWellness(mood) {
  const prompt = `You are MoodSpace, a compassionate wellness guide. A user is feeling "${mood.label}" ${mood.emoji}.

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

Give exactly 3 exercises and 3 art activities. Warm, poetic, empowering — never clinical. Tailor deeply to "${mood.label}". Music section complements an ambient generative soundscape in ${mood.musicConfig.key} at ${mood.musicConfig.tempo} BPM.`;

  // Fallback content generated per mood so the app always works
  const fallback = generateFallback(mood);

  try {
    const response = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://api.anthropic.com/v1/messages"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    const text = data.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");

    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.log("Using built-in wellness content for", mood.label);
    return fallback;
  }
}

function generateFallback(mood) {
  const content = {
    Happy: {
      movement: {
        title: "Dance Into Your Light",
        description: "When joy flows through you, let your body celebrate it — movement amplifies happiness.",
        exercises: [
          { name: "Joy Shake", duration: "2 minutes", instruction: "Stand with feet hip-width apart. Shake your hands, then arms, then let it ripple through your whole body. Let yourself smile, laugh, or make sounds — whatever feels natural.", benefit: "Shaking releases endorphins and lets your body physically express the happiness you feel inside." },
          { name: "Victory Stretch", duration: "3 minutes", instruction: "Reach both arms overhead in a wide V shape. Rise onto your toes and stretch as tall as you can. Hold for 5 breaths, then sweep your arms down and repeat.", benefit: "Expansive postures reinforce positive emotions and signal confidence to your nervous system." },
          { name: "Gratitude Walk", duration: "5 minutes", instruction: "Walk slowly around your space. With each step, silently name one thing you're grateful for. Let your pace match your breathing — unhurried and full.", benefit: "Pairing movement with gratitude deepens your sense of contentment and presence." }
        ],
      },
      art: {
        title: "Colors of Celebration",
        description: "Happiness wants to be expressed — let color and shape carry your joy onto the page.",
        activities: [
          { name: "Burst of Color", materials: "Paper, markers or crayons in bright colors", prompt: "Fill an entire page with overlapping circles, spirals, and sunbursts using only warm, bright colors. Don't plan — just let your hand move with the energy you feel. Let each shape overlap and bleed into the next.", reflection: "Which color felt the most like your happiness today?" },
          { name: "Joy Collage", materials: "Old magazines, scissors, glue, paper", prompt: "Flip through magazines quickly and tear out anything that catches your eye — images, words, textures. Arrange them on paper without overthinking. This is a snapshot of what joy looks like to you right now.", reflection: "What surprised you about what you chose?" },
          { name: "Letter to Your Happy Self", materials: "Pen and paper", prompt: "Write a short letter from your current happy self to your future self who might need encouragement. Describe how you feel right now, what made you smile, and what you want to remember about this moment.", reflection: "What would it mean to receive this letter on a harder day?" }
        ],
      },
      music: {
        title: "A Bright Hum of Joy",
        description: "This uplifting soundscape mirrors your inner brightness — let it amplify what you already feel.",
        listening_prompt: "Close your eyes and let the bright, dancing notes land wherever they want in your body. Notice where you feel the happiness most — your chest, your hands, your face. Breathe into that spot and let the warmth expand with each note.",
        journaling_prompt: "What is one small thing that brought you joy today that you might normally overlook?",
      },
    },
    Sad: {
      movement: {
        title: "Gentle Waves of Release",
        description: "Sadness often settles in the body — slow, gentle movement helps it begin to flow again.",
        exercises: [
          { name: "Heart-Opening Stretch", duration: "3 minutes", instruction: "Sit or stand comfortably. Interlace your fingers behind your back and gently lift your hands away from your body, opening your chest. Hold for 5 slow breaths, then release. Repeat three times.", benefit: "Opening the chest counters the protective hunching that sadness creates, gently inviting space for breath and emotion." },
          { name: "Slow Body Roll", duration: "3 minutes", instruction: "Stand with feet hip-width apart. Drop your chin to your chest and slowly roll down, one vertebra at a time, letting your arms hang heavy. Pause at the bottom for 3 breaths, then slowly roll back up.", benefit: "This slow unwinding releases tension stored in the spine and shoulders, creating a physical sense of letting go." },
          { name: "Rocking Comfort", duration: "4 minutes", instruction: "Sit on the floor and hug your knees to your chest. Gently rock side to side or forward and back, finding a rhythm that feels soothing. Close your eyes if you like.", benefit: "Rhythmic rocking activates the parasympathetic nervous system, creating the same comfort as being held." }
        ],
      },
      art: {
        title: "Honoring the Blue",
        description: "Art doesn't ask you to fix your sadness — it asks you to give it a shape, a color, a voice.",
        activities: [
          { name: "Watercolor Wash", materials: "Paper, watercolors or wet markers, water", prompt: "Wet your paper lightly with water. Drop blue, purple, and gray onto the wet surface and watch the colors bleed and blend on their own. Don't try to control it — let the water carry the pigment wherever it wants to go.", reflection: "Did watching the colors move on their own feel comforting or unsettling? What does that tell you?" },
          { name: "Emotion Landscape", materials: "Paper and any drawing tools", prompt: "Draw a landscape that represents how your sadness feels — it could be a quiet ocean, a foggy forest, an empty field at dusk. There are no wrong answers. Focus on the atmosphere, not the details.", reflection: "If you could walk into this landscape, where would you sit down and rest?" },
          { name: "Unsent Letter", materials: "Pen and paper", prompt: "Write a letter to your sadness as if it were a person visiting you. Tell it what you notice about its presence — where it sits in your body, what it brought with it, what it might need from you today.", reflection: "If your sadness could write back, what do you think it would say?" }
        ],
      },
      music: {
        title: "A Soft Place to Land",
        description: "This warm, slow soundscape holds space for whatever you're feeling — no rush, no fixing.",
        listening_prompt: "Let the slow, warm tones wash over you like a gentle tide. You don't need to do anything with your sadness right now. Just breathe and notice. Inhale for four counts, exhale for six. Let the music carry what feels too heavy to hold alone.",
        journaling_prompt: "What is your sadness trying to protect or honor right now?",
      },
    },
    Angry: {
      movement: {
        title: "Fire Into Motion",
        description: "Anger is energy — channel it through powerful movement so it moves through you instead of staying stuck.",
        exercises: [
          { name: "Power Punches", duration: "2 minutes", instruction: "Stand with feet wide and fists up. Punch forward alternating arms — hard, fast, with intention. Exhale sharply with each punch. Let yourself grunt or shout if it helps.", benefit: "Vigorous upper-body movement discharges the fight energy that anger activates in your nervous system." },
          { name: "Stomping Ground", duration: "2 minutes", instruction: "March in place with heavy, deliberate stomps. Lift your knees high and let each foot land with force. Feel the impact travel up through your legs. Speed up, then gradually slow down.", benefit: "Stomping grounds your energy downward and gives your body a safe, powerful outlet for frustration." },
          { name: "Lion's Breath", duration: "3 minutes", instruction: "Sit or kneel. Inhale deeply through your nose. Then open your mouth wide, stick out your tongue, and exhale forcefully with a 'HAAA' sound. Widen your eyes. Repeat 8-10 times.", benefit: "This breath releases jaw and facial tension where anger often grips, and the vocalization provides emotional release." }
        ],
      },
      art: {
        title: "The Shape of Fire",
        description: "Anger deserves expression — not suppression. Let your hands move with the intensity you feel.",
        activities: [
          { name: "Scribble Storm", materials: "Large paper, dark crayons or markers", prompt: "Take a dark crayon in your dominant hand. Set a timer for 90 seconds and scribble as hard and fast as you can. Press down. Fill the page. Tear through it if you want. This isn't about making something beautiful — it's about letting the energy out.", reflection: "How do your hands feel now compared to before you started?" },
          { name: "Tear and Rebuild", materials: "Old newspaper or magazines, glue, paper", prompt: "Tear paper into pieces — rip it with your hands, crumple sections, shred edges. Then arrange the torn pieces into a new composition on a fresh page. Transform destruction into creation.", reflection: "What changed in your body between the tearing and the rebuilding?" },
          { name: "Boundary Drawing", materials: "Paper and a bold pen or marker", prompt: "Draw a thick, strong border around the edge of your paper — this is your boundary. Inside it, write or draw everything that has crossed your boundaries recently. Outside it, write what you want to protect.", reflection: "What boundary matters most to you right now?" }
        ],
      },
      music: {
        title: "Ember and Exhale",
        description: "This grounding soundscape meets your intensity without flinching — breathe with it and let the fire move.",
        listening_prompt: "Notice the darker tones pulsing beneath the melody. Match your breath to them — inhale tension, exhale heat. Imagine each exhale is smoke leaving your body, carrying the sharp edges of your anger out into open air where they can dissolve.",
        journaling_prompt: "Beneath your anger, what feeling is asking to be heard?",
      },
    },
    Anxious: {
      movement: {
        title: "Anchoring to Earth",
        description: "Anxiety lifts you out of your body — these movements bring you gently back down to solid ground.",
        exercises: [
          { name: "5-4-3-2-1 Walk", duration: "4 minutes", instruction: "Walk slowly around your space. Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Pause between each sense and take a breath.", benefit: "This sensory grounding technique pulls your attention out of anxious thoughts and into the present moment." },
          { name: "Butterfly Hug", duration: "2 minutes", instruction: "Cross your arms over your chest so each hand rests on the opposite shoulder. Tap alternating hands gently — left, right, left, right — at a slow, steady rhythm. Close your eyes and breathe.", benefit: "Bilateral stimulation calms the amygdala and reduces the body's anxiety response, similar to EMDR therapy." },
          { name: "Root and Rise", duration: "3 minutes", instruction: "Stand barefoot if possible. Press your feet into the ground and imagine roots growing from your soles deep into the earth. On each inhale, draw stability upward. On each exhale, release tension downward.", benefit: "Grounding through the feet activates proprioceptive awareness, countering the floating feeling anxiety creates." }
        ],
      },
      art: {
        title: "Threading Calm",
        description: "When your mind races, your hands can lead it back — repetitive, gentle creating soothes an anxious brain.",
        activities: [
          { name: "Pattern Breathing", materials: "Paper and a fine pen", prompt: "Draw a simple repeating pattern — circles, waves, dots, or crosshatches. Synchronize each stroke with your breath: draw on the exhale, pause on the inhale. Fill an entire page with this meditative rhythm.", reflection: "Did the pattern change as you settled in? What does that tell you about your anxiety's arc?" },
          { name: "Worry Jar Sketch", materials: "Paper and colored pencils", prompt: "Draw a large jar in the center of your page. Inside it, write or sketch each worry you're carrying right now — small ones, big ones, silly ones. Then draw a tight lid on top. The jar holds them so you don't have to.", reflection: "Which worry felt lighter once it was outside your head and on the page?" },
          { name: "Safe Space Map", materials: "Paper and any coloring tools", prompt: "Draw or paint a place — real or imaginary — where you feel completely safe. Fill it with details: the light, the textures, the sounds, who or what is there with you. Make it as vivid and cozy as you can.", reflection: "What element of your safe space could you bring into your real environment today?" }
        ],
      },
      music: {
        title: "Slow Waves, Still Shore",
        description: "This ethereal soundscape slows the tempo of your thoughts — let it be an anchor, not a distraction.",
        listening_prompt: "Place one hand on your chest and one on your belly. Breathe in slowly for 4 counts, hold for 4, exhale for 6. Let the floating tones fill the space between your thoughts. You don't need to stop your mind — just give it this slow, gentle rhythm to follow.",
        journaling_prompt: "What would you do differently today if you knew everything would be okay?",
      },
    },
    Tired: {
      movement: {
        title: "Tender Restoration",
        description: "When you're depleted, movement should replenish — not demand. These are soft invitations, not commands.",
        exercises: [
          { name: "Supported Child's Pose", duration: "3 minutes", instruction: "Kneel on the floor and fold forward, resting your forehead on your stacked hands or a pillow. Let your arms relax completely. Breathe into your lower back and feel it expand with each inhale.", benefit: "This restorative pose signals deep safety to your nervous system, allowing true rest without falling asleep." },
          { name: "Neck Circles", duration: "2 minutes", instruction: "Drop your chin to your chest. Slowly roll your head to the right, then back, then left, making a full gentle circle. Do 5 circles in each direction. Move at the speed of honey.", benefit: "Releasing neck tension improves blood flow to the brain and relieves the heaviness that fatigue creates in the head and shoulders." },
          { name: "Legs Up the Wall", duration: "5 minutes", instruction: "Lie on your back and rest your legs up against a wall, forming an L shape. Let your arms rest by your sides, palms up. Close your eyes and just breathe.", benefit: "Inverting your legs reverses blood pooling, reduces swelling, and activates the parasympathetic rest-and-digest response." }
        ],
      },
      art: {
        title: "Soft Marks, Slow Hands",
        description: "Tired creativity doesn't push — it meanders. Let your art be as gentle as you need right now.",
        activities: [
          { name: "Cloud Gazing on Paper", materials: "Paper and soft pastels or light pencils", prompt: "Using only the lightest pressure, draw soft, overlapping cloud shapes across your page. Blend them gently with your fingertips. There's no form to find — just softness meeting softness.", reflection: "What would it feel like to give yourself permission to rest as fully as these clouds?" },
          { name: "Energy Map", materials: "Paper and colored pencils", prompt: "Draw an outline of your body. Using colors, shade in where you feel depleted (cool colors) and where any energy remains (warm colors). Don't judge the map — just notice it honestly.", reflection: "What is your body asking for right now that you haven't given it yet?" },
          { name: "One Beautiful Sentence", materials: "Pen and paper", prompt: "Write a single sentence — the most beautiful one you can manage right now. It can be about anything. Spend your remaining creative energy making just these few words feel perfect.", reflection: "If this sentence were a gift to yourself, what would it mean to receive it?" }
        ],
      },
      music: {
        title: "A Lullaby for the Awake",
        description: "This dreamy soundscape doesn't ask you to wake up — it asks you to soften even further into where you are.",
        listening_prompt: "Let your eyes close halfway or all the way. Feel the weight of your body settling into whatever surface holds you. The music is slow enough to match your quietest breath. You don't need to listen actively — just let the sound hold you like warm water.",
        journaling_prompt: "When was the last time you rested without guilt, and what made that possible?",
      },
    },
    Excited: {
      movement: {
        title: "Sparks in Every Step",
        description: "Excitement is lightning looking for ground — let your body become the conductor.",
        exercises: [
          { name: "Freestyle Dance", duration: "3 minutes", instruction: "Put on your favorite upbeat song (or let the soundscape carry you) and dance however your body wants. No choreography, no mirror, no judgment — just pure movement joy.", benefit: "Unstructured dancing releases dopamine and lets excitement express itself fully through every muscle." },
          { name: "Star Jumps", duration: "2 minutes", instruction: "Jump and spread your arms and legs into a star shape in the air. Land softly and repeat. Start slow, then pick up speed. Let yourself feel the thrill of being airborne.", benefit: "Explosive movement matches your high energy and channels it into a satisfying physical rhythm." },
          { name: "Speed Sketch Sprints", duration: "3 minutes", instruction: "Grab a pen. Set a 30-second timer and draw whatever comes to mind — fast. Reset and draw something new. Repeat 6 times. Speed over precision — let the excitement drive your hand.", benefit: "Rapid creative output channels mental excitement into tangible form, satisfying the urge to create and express." }
        ],
      },
      art: {
        title: "Electric Imagination",
        description: "Excitement is creative fuel at its purest — pour it onto the page before it fades.",
        activities: [
          { name: "Splatter Joy", materials: "Paper, watered-down paint or food coloring, brushes", prompt: "Flick, drip, and splatter paint across a large sheet of paper. Use bold colors. Don't aim — just let the energy of your movements create the pattern. Celebrate the mess.", reflection: "Which splatter pattern feels most like your excitement right now, and why?" },
          { name: "Dream Board Sprint", materials: "Magazines, scissors, glue, large paper", prompt: "Set a 10-minute timer. Tear through magazines and grab every image that excites you — don't think, just grab. Glue them all down in a wild, overlapping collage of everything that thrills you right now.", reflection: "What theme connects the images you chose without realizing it?" },
          { name: "Future Letter", materials: "Pen and colorful paper", prompt: "Write a letter from your future self who achieved the thing you're most excited about. Describe what the day feels like, what you see around you, how it felt to get there. Be specific and vivid.", reflection: "What is the very first step you could take toward this future today?" }
        ],
      },
      music: {
        title: "Bright Sparks Rising",
        description: "This vibrant soundscape matches your electric energy — ride the rhythm and let it amplify your spark.",
        listening_prompt: "Feel the quick, bright notes landing like sparklers in the air around you. Tap your fingers, bounce your knee, nod your head — let your body sync with the rhythm. This music is here to celebrate with you, not calm you down.",
        journaling_prompt: "What are you most excited about right now, and what makes it feel so alive?",
      },
    },
    Numb: {
      movement: {
        title: "Gently Waking the Body",
        description: "Numbness is your system's pause button — these movements are soft knocks on the door, not demands to open it.",
        exercises: [
          { name: "Fingertip Awakening", duration: "2 minutes", instruction: "Press your fingertips together firmly in front of your chest. Hold for 10 seconds, then release. Spread your fingers wide. Repeat 5 times, noticing the tingling sensation each time you release.", benefit: "Focused pressure and release activates nerve endings and brings gentle awareness back to your extremities." },
          { name: "Temperature Touch", duration: "3 minutes", instruction: "Hold something cold (ice cube, cold glass) in one hand for 30 seconds, then switch to something warm (warm mug, heated cloth). Alternate 3 times, paying attention to what you feel.", benefit: "Temperature contrast stimulates sensory receptors and gently re-engages your body's awareness system." },
          { name: "Slow Spinal Wave", duration: "3 minutes", instruction: "Sit in a chair. Starting from your lower back, slowly arch your spine forward one vertebra at a time until your chest opens. Then reverse, rounding from the top down. Move like a slow wave through your spine.", benefit: "Spinal movement activates the central nervous system and creates a gentle internal massage that brings awareness inward." }
        ],
      },
      art: {
        title: "Finding Texture Again",
        description: "When emotions feel distant, art invites sensation back — not through force, but through curiosity.",
        activities: [
          { name: "Texture Rubbing", materials: "Paper and crayons", prompt: "Place your paper over different textured surfaces — wood grain, fabric, coins, leaves. Rub a crayon over each one to reveal the hidden pattern beneath. Collect as many textures as you can find.", reflection: "Which texture surprised you the most, and what did it feel like under your hand?" },
          { name: "Inside/Outside Drawing", materials: "Paper and two different colored pens", prompt: "Draw a simple shape in the center of your page — a circle, a square, a body outline. Using one color, fill the inside with what you think you should be feeling. Using the other color, fill the outside with what's actually there (even if it's nothing).", reflection: "Is there a gap between the inside and outside? What lives in that gap?" },
          { name: "Color of Nothing", materials: "Paper and any medium", prompt: "If numbness had a color, what would it be? A texture? A weight? Try to paint or draw the feeling of nothing. Give the absence a form. This isn't about making it go away — it's about acknowledging it's here.", reflection: "Did giving your numbness a visual form change how it feels, even slightly?" }
        ],
      },
      music: {
        title: "Quiet Signals Home",
        description: "This ethereal soundscape doesn't try to force feeling — it simply offers gentle signals that you're still here.",
        listening_prompt: "You don't need to feel anything specific right now. Just notice the sounds arriving and leaving. Place your hand over your heart and feel its rhythm. The music is a quiet companion, not a cure. Let it exist alongside your stillness without asking it to change anything.",
        journaling_prompt: "If your numbness could speak, what might it be protecting you from feeling?",
      },
    },
    Loved: {
      movement: {
        title: "Softening Into Warmth",
        description: "Love opens us — these movements honor that openness and let warmth circulate through your whole body.",
        exercises: [
          { name: "Heart-Center Breathing", duration: "3 minutes", instruction: "Place both hands over your heart. Breathe in slowly for 5 counts, imagining warmth flowing into your chest. Exhale for 5 counts, imagining that warmth spreading outward through your whole body.", benefit: "Heart-focused breathing activates the vagus nerve and releases oxytocin, deepening the feeling of love and connection." },
          { name: "Self-Embrace", duration: "2 minutes", instruction: "Wrap your arms around yourself in a firm hug. Squeeze gently. Rock side to side if it feels natural. Hold for at least 30 seconds, then release and notice how your body feels.", benefit: "Self-hugging triggers the same neurochemical response as being hugged by someone else — it's genuine comfort." },
          { name: "Gratitude Stretch", duration: "3 minutes", instruction: "Stand tall and reach your arms wide open, palms facing up, chest lifted. Hold this open posture and breathe deeply. With each breath, silently name someone or something you love.", benefit: "Open postures combined with gratitude create a powerful positive feedback loop in the brain and body." }
        ],
      },
      art: {
        title: "Portraits of Tenderness",
        description: "Being loved is worth savoring — let your art slow down this feeling so you can hold it a little longer.",
        activities: [
          { name: "Love Map", materials: "Paper and colored pencils", prompt: "Draw a simple map of your life with the people, places, and moments that have made you feel most loved marked as landmarks. Connect them with paths that show how they led to each other.", reflection: "Looking at your map, what pattern do you notice about when and where you feel most loved?" },
          { name: "Warmth Painting", materials: "Paper and warm-toned paints or markers (reds, pinks, golds, oranges)", prompt: "Using only warm colors, paint abstract shapes that represent how love feels in your body. Soft circles, glowing halos, gentle waves — whatever warmth looks like to you.", reflection: "Where in your body did you feel the warmth while creating this?" },
          { name: "Thank You Note Art", materials: "Nice paper and your favorite pen", prompt: "Write a thank-you note to someone who makes you feel loved — but make it beautiful. Decorate the borders, use your best handwriting, add small drawings. Make the object itself an expression of care.", reflection: "What would it mean to this person to receive something made with this much intention?" }
        ],
      },
      music: {
        title: "Wrapped in Golden Sound",
        description: "This warm soundscape is a musical embrace — let it hold the feeling of being loved for a little longer.",
        listening_prompt: "Let the warm, round tones settle around you like a blanket. Breathe slowly and think of someone who makes you feel safe. Picture their face, their voice, the way they make you feel. Let the music hold that image gently in place.",
        journaling_prompt: "How do you most like to receive love, and how do you most like to give it?",
      },
    },
    Lost: {
      movement: {
        title: "One Step, Then Another",
        description: "When you feel lost, your body can lead when your mind can't — trust the simplest movements to guide you back.",
        exercises: [
          { name: "Grounding Walk", duration: "4 minutes", instruction: "Walk very slowly, feeling each part of your foot make contact with the ground — heel, arch, toes. Count each step up to 10, then start over. If your mind wanders, gently return to counting.", benefit: "Hyperfocusing on the physical mechanics of walking anchors you in the present moment when everything else feels uncertain." },
          { name: "Compass Stretch", duration: "3 minutes", instruction: "Stand in the center of your space. Reach toward the north wall, stretching fully. Then east, south, west. Repeat the cycle slowly, reaching a little further each time.", benefit: "Orienting your body in physical space counteracts the disorientation that feeling emotionally lost creates." },
          { name: "Mountain Pose Hold", duration: "3 minutes", instruction: "Stand with feet together, arms by your sides, shoulders back. Close your eyes. Imagine you are a mountain — ancient, still, unmoved by weather. Hold this pose for 10 slow breaths.", benefit: "Standing still with intention builds a visceral sense of stability when everything around you feels unfamiliar." }
        ],
      },
      art: {
        title: "Mapping the Fog",
        description: "Being lost isn't failure — it's the space before finding. Art can help you see the path forming beneath your feet.",
        activities: [
          { name: "Fog Drawing", materials: "Paper and soft pencils or charcoal", prompt: "Draw a dense fog covering most of your page. Then, somewhere in it, sketch the faintest outline of something emerging — a door, a path, a light, a figure. It doesn't need to be clear. Just the suggestion of something ahead.", reflection: "What do you think is trying to emerge from your fog right now?" },
          { name: "Crossroads Map", materials: "Paper and pens", prompt: "Draw yourself at the center of a crossroads. Label each path with a different direction your life could go — real possibilities, wild dreams, safe choices, scary leaps. Don't choose yet. Just see them all laid out.", reflection: "Which path made your hand hesitate the most, and what does that hesitation mean?" },
          { name: "Found Object Compass", materials: "Small objects from around your space", prompt: "Gather 4-5 small objects from your immediate surroundings. Arrange them in a pattern that feels meaningful — a circle, a line, a compass shape. This is your temporary altar to not-knowing. Let it exist without explanation.", reflection: "If these objects could speak as a group, what direction would they point you toward?" }
        ],
      },
      music: {
        title: "Drifting Toward Dawn",
        description: "This dreamy soundscape doesn't know the way either — and that's okay. It'll drift alongside you until clarity comes.",
        listening_prompt: "Let the wandering notes mirror your state of mind. You don't need to find direction right now. Just float. Breathe in through your nose for 4 counts, out through your mouth for 6. Each exhale releases the pressure to have answers. Being lost is a place too.",
        journaling_prompt: "What would you do next if you trusted that being lost is part of finding your way?",
      },
    },
  };

  return content[mood.label] || content.Happy;
}
