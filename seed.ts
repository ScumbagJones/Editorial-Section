import { db } from './server/db';
import { featuredStories } from './shared/schema';

async function seed() {
  console.log('Seeding featured stories...');
  
  const stories = [
    {
      title: 'The New Wave of Digital Expression',
      excerpt: 'Exploring how contemporary artists are redefining creativity through digital mediums, breaking traditional boundaries between art and technology.',
      author: 'Editorial Team',
      category: 'art',
      imageUrl: null,
      isActive: true,
      isFeatured: true
    },
    {
      title: 'Street Style Renaissance',
      excerpt: 'From underground scenes to mainstream fashion, discover how street culture continues to influence contemporary style movements.',
      author: 'Style Collective',
      category: 'fashion',
      imageUrl: null,
      isActive: true,
      isFeatured: false
    },
    {
      title: 'Capturing Urban Stories',
      excerpt: 'Photography as a medium for social commentary - documenting the pulse of city life through intimate street portraits.',
      author: 'Photo Bureau',
      category: 'photography',
      imageUrl: null,
      isActive: true,
      isFeatured: false
    }
  ];

  for (const story of stories) {
    await db.insert(featuredStories).values(story);
    console.log('✓ Added:', story.title);
  }
  
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);