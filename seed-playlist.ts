import { db } from "./server/db";
import { submissions } from "./shared/schema";

async function seedPlaylistSubmission() {
  try {
    // Create a test playlist submission
    const playlistSubmission = await db.insert(submissions).values({
      title: "Late Night Vibes",
      description: "This playlist captures that perfect late-night energy - soft synths, dreamy vocals, and beats that make you want to drive through the city at 2am. Found myself coming back to these tracks over and over while working on creative projects.",
      submitterHandle: "@moonchild",
      submitterEmail: "test@example.com",
      category: "quick-share",
      contentType: "playlist",
      status: "approved",
      collaborationLinks: ["https://open.spotify.com/playlist/43ElYXM6C9t1AzAeQLuddy?si=ef1c38c7f27842b9"],
      externalPlatform: "spotify",
      section: "community"
    }).returning();

    console.log('✅ Playlist submission created:', playlistSubmission[0]);

    // Create a few more community submissions for variety
    const poemSubmission = await db.insert(submissions).values({
      title: "Morning Coffee Thoughts",
      description: "Steam rises from my cup\nLike thoughts that can't quite form\nAnother day begins\nWith caffeine and hope",
      submitterHandle: "@wordsmith",
      submitterEmail: "poet@example.com",
      category: "quick-share",
      contentType: "text",
      status: "approved",
      section: "community"
    }).returning();

    const drawingSubmission = await db.insert(submissions).values({
      title: "City Sketches",
      description: "Been carrying my sketchbook everywhere lately. These are quick studies of people on the subway - the way they hold their phones, lean against doors, exist in their own worlds while surrounded by strangers.",
      submitterHandle: "@inkfingers",
      submitterEmail: "artist@example.com",
      category: "quick-share",
      contentType: "image",
      status: "approved",
      collaborationLinks: ["https://instagram.com/example"],
      section: "community"
    }).returning();

    console.log('✅ Additional community submissions created');
    console.log('✅ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding playlist submission:', error);
  }
}

seedPlaylistSubmission();