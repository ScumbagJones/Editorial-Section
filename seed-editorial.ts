import { db } from "./server/db";
import { submissions } from "./shared/schema";

async function seedEditorial() {
  // Sample editorial content inspired by your Playboi Carti essay
  const editorialSubmissions = [
    {
      submitterHandle: "jarradjones7",
      submitterEmail: "jarrad@enamorado.com",
      title: "Reviewing Playboi Carti's I Am Music: Contextualizing Overconsumption in Modern Rap",
      description: `After four years, Playboi Carti's fourth album is finally here. I Am Music has been met with confusion and awe: some call it a trap masterpiece, others claim he's doing too much. But that too-muchness is the point. This is "burnt music," as Carti and CardoGotWings teased in 2024—a piston engine with no oil, misfiring on purpose.

It blends the abrasiveness of hyperpop (100 Gecs) and traditional trap music. I Am Music doesn't sound polished or controlled. It sounds like a car engine redlining on purpose, shaking itself apart. It's rap pushed so far past its limits it becomes something else entirely. Carti's sound on this album is brutal even more so than WLR but not in a violent way. But in the way brutalist architecture is: overwhelming, jagged, all sharp angles and exposed structure.

Take a song like "OPM BABI." The first time I heard it, I couldn't sit through it—it was too much. Too chaotic. But then I started seeing people rave about it, and it started showing up in short-form edits online. And suddenly, it made sense. It wasn't just noise—it was perfect for now. The harshness becomes the point.

Carti's persona doesn't follow a clear arc. There's no evolution, no moral center, no plot—just constant transformation. His voice shifts, his flows bend, his energy moves erratically from track to track. He's not building a legacy like Kendrick, or even constructing a mythology like Future. He's doing what Thug started—pushing swag rap beyond image or meaning, into pure feeling.

This connects to how DS2 shaped modern trap's emotional architecture. Future wasn't glorifying addiction—he was embodying it. He made overconsumption beautiful. Melodic. Even aspirational. That's the genius of DS2: it didn't need to tell a story, because the vibe was the story. Hedonism became ambiance. And that aesthetic didn't stay in rap—it spread.

It helped shape the emotional tone of culture at large. That's what makes albums like Brat, and shows like Euphoria, feel less like outliers and more like evolutions. They don't just exist in excess—they respond to it, sometimes with satire, sometimes with sincerity, sometimes both at once.

In conclusion, "I Am Music" operates as both a product of and commentary on consumer culture. Carti doesn't reject the system but instead exposes its mechanisms through exaggeration and repetition. The album succeeds in making the listener aware of their own participation in cycles of consumption, both musical and material.`,
      category: "conversation",
      files: [],
      collaborationLinks: ["https://jarradjones7.substack.com/p/reviewing-playboi-cartis-i-am-music"],
      socialHandle: "@jarradjones7",
      status: "approved",
      editorialStatus: "ready",
      section: "editorial"
    }
  ];

  try {
    for (const submission of editorialSubmissions) {
      await db.insert(submissions).values(submission);
    }
    console.log("Editorial submissions seeded successfully!");
  } catch (error) {
    console.error("Error seeding editorial submissions:", error);
  }
}

seedEditorial();