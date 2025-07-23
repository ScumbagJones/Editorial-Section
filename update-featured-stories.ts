import { storage } from "./server/storage";

async function updateFeaturedStories() {
  console.log("Updating featured stories with real Substack articles...");

  // Article 1: Clairo review by Jarrad
  await storage.createFeaturedStory({
    title: "Reviewing Clairo's 'Charm'",
    excerpt: "Clairo's 'Charm' is her third studio album and feels like her most forward facing one yet. Her writing and production have never sounded so polished and full as they do on this record.",
    author: "Jarrad!",
    category: "Music Review",
    imageUrl: "https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff62cca3a-88ca-4346-8a74-8fc704ce26f8_2000x3000.webp",
    isActive: true,
    isFeatured: true
  });

  // Article 2: Charli XCX by Club Ciné  
  await storage.createFeaturedStory({
    title: "Charli xcx on Céline and Julie Go Boating",
    excerpt: "I feel seen when I watch Céline and Julie Go Boating. It trips me the fuck out and gets me seriously flustered. I'm obsessed with loops and cyclical storytelling.",
    author: "Club Ciné",
    category: "Film & Culture",
    imageUrl: "https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F938ad1ac-546e-475e-98d9-7b076f2797d5_2250x1125.jpeg",
    isActive: true,
    isFeatured: true
  });

  // Article 3: Sabrina Carpenter by Faith
  await storage.createFeaturedStory({
    title: "On Female Friendships: Sabrina Carpenter",
    excerpt: "Female friendships have always been a complicated subject for me to navigate, especially as someone who has struggled with maintaining close relationships.",
    author: "faith",
    category: "Cultural Commentary",
    imageUrl: "https://substackcdn.com/image/fetch/w_176,h_176,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa4cefb74-7bfc-4e0c-8246-8a9179e67e1a_1280x1280.png",
    isActive: true,
    isFeatured: false
  });

  console.log("Featured stories updated successfully!");
}

updateFeaturedStories().catch(console.error);