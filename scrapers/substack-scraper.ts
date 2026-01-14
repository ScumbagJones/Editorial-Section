/**
 * Substack RSS Feed Scraper
 *
 * Scrapes Substack publications via their public RSS feeds and maps
 * the content to your database schema.
 *
 * Usage:
 *   npm install xml2js
 *   node -r tsx scrapers/substack-scraper.ts
 */

import { parseString } from 'xml2js';
import { db } from '../server/db';
import { submissions, featuredStories } from '../shared/schema';

interface SubstackFeedItem {
  title: string[];
  link: string[];
  pubDate: string[];
  'content:encoded': string[];
  'dc:creator': string[];
  category?: string[];
  description?: string[];
}

interface SubstackFeed {
  rss: {
    channel: [{
      item: SubstackFeedItem[];
      title: string[];
      link: string[];
    }];
  };
}

// Curated list of Substacks to scrape
const SUBSTACK_SOURCES = [
  {
    url: 'https://dirt.substack.com/feed',
    name: 'Dirt',
    category: 'conversation' as const,
    section: 'editorial' as const
  },
  {
    url: 'https://kyleschayka.substack.com/feed',
    name: 'Kyle Chayka',
    category: 'conversation' as const,
    section: 'editorial' as const
  },
  {
    url: 'https://bloodknife.com/feed',
    name: 'Blood Knife',
    category: 'art' as const,
    section: 'editorial' as const
  },
  // Add your own Substacks here
];

class SubstackScraper {
  private rateLimit = 2000; // 2 seconds between requests

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchFeed(url: string): Promise<SubstackFeed> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Enamorado Editorial Bot/1.0 (San Antonio Creative Platform)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xml = await response.text();

      return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
          if (err) reject(err);
          else resolve(result as SubstackFeed);
        });
      });
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  extractExcerpt(html: string, maxLength = 300): string {
    // Strip HTML tags
    const text = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Get first 2-3 sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    let excerpt = sentences.slice(0, 3).join(' ');

    if (excerpt.length > maxLength) {
      excerpt = excerpt.slice(0, maxLength) + '...';
    }

    return excerpt;
  }

  extractImageUrl(html: string): string | null {
    // Extract first image from HTML content
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  }

  async scrapeFeed(source: typeof SUBSTACK_SOURCES[0], limit = 5) {
    console.log(`\n📰 Scraping ${source.name}...`);

    const feed = await this.fetchFeed(source.url);
    const items = feed.rss.channel[0].item.slice(0, limit);

    const results = [];

    for (const item of items) {
      const title = item.title[0];
      const url = item.link[0];
      const author = item['dc:creator']?.[0] || source.name;
      const pubDate = new Date(item.pubDate[0]);
      const htmlContent = item['content:encoded']?.[0] || '';

      const excerpt = this.extractExcerpt(htmlContent);
      const imageUrl = this.extractImageUrl(htmlContent);

      results.push({
        title,
        excerpt,
        author,
        url,
        pubDate,
        imageUrl,
        category: source.category,
        section: source.section,
      });

      console.log(`  ✓ ${title.slice(0, 60)}...`);
    }

    return results;
  }

  async saveToFeaturedStories(articles: any[]) {
    console.log(`\n💾 Saving ${articles.length} articles to featured_stories...`);

    for (const article of articles) {
      try {
        await db.insert(featuredStories).values({
          title: article.title,
          excerpt: article.excerpt,
          author: article.author,
          category: article.category,
          imageUrl: article.imageUrl,
          externalUrl: article.url,
          isActive: true,
          isFeatured: false, // Manually curate later
        });

        console.log(`  ✓ Saved: ${article.title.slice(0, 50)}...`);
      } catch (error: any) {
        if (error.code === '23505') { // Duplicate key
          console.log(`  ⊗ Duplicate: ${article.title.slice(0, 50)}...`);
        } else {
          console.error(`  ✗ Error saving ${article.title}:`, error);
        }
      }
    }
  }

  async saveToSubmissions(articles: any[]) {
    console.log(`\n💾 Saving ${articles.length} articles to submissions...`);

    for (const article of articles) {
      try {
        await db.insert(submissions).values({
          title: article.title,
          description: article.excerpt,
          submitterHandle: 'Editorial',
          submitterEmail: 'editorial@enamorado.com',
          category: article.category,
          contentType: 'substack',
          substackUrl: article.url,
          originalAuthor: article.author,
          originalDate: article.pubDate,
          originalExcerpt: article.excerpt,
          status: 'pending', // Review before publishing
          editorialStatus: 'pending',
          section: article.section,
          collaborationLinks: [article.url],
          files: article.imageUrl ? [article.imageUrl] : [],
        });

        console.log(`  ✓ Saved: ${article.title.slice(0, 50)}...`);
      } catch (error: any) {
        if (error.code === '23505') {
          console.log(`  ⊗ Duplicate: ${article.title.slice(0, 50)}...`);
        } else {
          console.error(`  ✗ Error saving ${article.title}:`, error);
        }
      }
    }
  }

  async runFullScrape(saveAs: 'featured' | 'submissions' = 'featured') {
    console.log('🚀 Starting Substack scraper...\n');

    const allArticles = [];

    for (const source of SUBSTACK_SOURCES) {
      try {
        const articles = await this.scrapeFeed(source);
        allArticles.push(...articles);

        // Rate limiting - be respectful
        await this.sleep(this.rateLimit);
      } catch (error) {
        console.error(`Failed to scrape ${source.name}:`, error);
      }
    }

    console.log(`\n📊 Total articles scraped: ${allArticles.length}`);

    if (saveAs === 'featured') {
      await this.saveToFeaturedStories(allArticles);
    } else {
      await this.saveToSubmissions(allArticles);
    }

    console.log('\n✅ Scraping complete!');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new SubstackScraper();

  // Change to 'submissions' if you want content to go through editorial review
  scraper.runFullScrape('featured')
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Scraper failed:', error);
      process.exit(1);
    });
}

export default SubstackScraper;
