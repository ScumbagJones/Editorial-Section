/**
 * Art & Photography Scraper
 *
 * Scrapes art/photography content from curated sources like Colossal,
 * It's Nice That, and Feature Shoot.
 *
 * Usage:
 *   npm install cheerio
 *   node -r tsx scrapers/art-scraper.ts
 */

import * as cheerio from 'cheerio';
import { db } from '../server/db';
import { submissions } from '../shared/schema';

interface ScrapedArtwork {
  title: string;
  description: string;
  artist: string;
  imageUrl: string | null;
  sourceUrl: string;
  category: 'art' | 'photography' | 'mixed';
  tags?: string[];
}

const SOURCES = {
  colossal: {
    name: 'Colossal',
    baseUrl: 'https://www.thisiscolossal.com',
    listingUrl: 'https://www.thisiscolossal.com/category/art/',
    category: 'art' as const,
    selectors: {
      articles: 'article.post',
      title: 'h2.entry-title a',
      link: 'h2.entry-title a',
      image: '.entry-content img',
      excerpt: '.entry-content p',
      author: '.author-name', // Usually the artist, not the writer
    }
  },
  featureShoot: {
    name: 'Feature Shoot',
    baseUrl: 'https://www.featureshoot.com',
    listingUrl: 'https://www.featureshoot.com/section/photo-of-the-day/',
    category: 'photography' as const,
    selectors: {
      articles: 'article',
      title: 'h2 a',
      link: 'h2 a',
      image: 'img',
      excerpt: '.excerpt',
    }
  },
};

class ArtScraper {
  private rateLimit = 3000; // 3 seconds - be extra respectful
  private userAgent = 'Enamorado Editorial Bot/1.0 (San Antonio Creative Platform; +https://enamorado.com)';

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchPage(url: string): Promise<string> {
    try {
      console.log(`  🌐 Fetching ${url}...`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  async scrapeColossal(limit = 5): Promise<ScrapedArtwork[]> {
    console.log('\n🎨 Scraping Colossal...');

    const source = SOURCES.colossal;
    const html = await this.fetchPage(source.listingUrl);
    const $ = cheerio.load(html);

    const artworks: ScrapedArtwork[] = [];

    $(source.selectors.articles).slice(0, limit).each((_, element) => {
      const $article = $(element);

      const titleEl = $article.find(source.selectors.title);
      const title = titleEl.text().trim();
      const sourceUrl = titleEl.attr('href') || '';

      const imageUrl = $article.find(source.selectors.image).first().attr('src') || null;
      const excerptText = $article.find(source.selectors.excerpt).first().text().trim();

      // Extract artist name from title (usually in format "Artist Name Does Something")
      const artistMatch = title.match(/^([^:]+?)(?:\s+Creates?|\s+Makes?|\s+Presents?|\s+Explores?)/i);
      const artist = artistMatch ? artistMatch[1].trim() : 'Unknown Artist';

      if (title && sourceUrl) {
        artworks.push({
          title,
          description: excerptText || `Featured artwork from ${artist}`,
          artist,
          imageUrl,
          sourceUrl,
          category: source.category,
          tags: ['colossal', 'contemporary-art'],
        });

        console.log(`  ✓ ${title.slice(0, 60)}...`);
      }
    });

    return artworks;
  }

  async scrapeFeatureShoot(limit = 5): Promise<ScrapedArtwork[]> {
    console.log('\n📸 Scraping Feature Shoot...');

    const source = SOURCES.featureShoot;
    const html = await this.fetchPage(source.listingUrl);
    const $ = cheerio.load(html);

    const artworks: ScrapedArtwork[] = [];

    $(source.selectors.articles).slice(0, limit).each((_, element) => {
      const $article = $(element);

      const titleEl = $article.find(source.selectors.title);
      const title = titleEl.text().trim();
      const sourceUrl = titleEl.attr('href') || '';

      const imageUrl = $article.find(source.selectors.image).first().attr('src') || null;
      const excerptText = $article.find(source.selectors.excerpt).text().trim();

      // Photographer is usually in the title
      const photographer = title.split(' by ')[1] || title.split(':')[0] || 'Unknown Photographer';

      if (title && sourceUrl) {
        artworks.push({
          title,
          description: excerptText || `Photography by ${photographer}`,
          artist: photographer,
          imageUrl,
          sourceUrl,
          category: source.category,
          tags: ['feature-shoot', 'photography'],
        });

        console.log(`  ✓ ${title.slice(0, 60)}...`);
      }
    });

    return artworks;
  }

  async saveToDatabase(artworks: ScrapedArtwork[]) {
    console.log(`\n💾 Saving ${artworks.length} artworks to database...`);

    for (const artwork of artworks) {
      try {
        await db.insert(submissions).values({
          title: artwork.title,
          description: artwork.description,
          submitterHandle: artwork.artist,
          submitterEmail: 'editorial@enamorado.com',
          category: artwork.category,
          contentType: 'mixed',
          originalAuthor: artwork.artist,
          originalDate: new Date(),
          originalExcerpt: artwork.description.slice(0, 200),
          status: 'pending', // Require editorial review
          editorialStatus: 'pending',
          section: 'editorial',
          collaborationLinks: [artwork.sourceUrl],
          files: artwork.imageUrl ? [artwork.imageUrl] : [],
        });

        console.log(`  ✓ Saved: ${artwork.title.slice(0, 50)}...`);
      } catch (error: any) {
        if (error.code === '23505') { // Duplicate
          console.log(`  ⊗ Duplicate: ${artwork.title.slice(0, 50)}...`);
        } else {
          console.error(`  ✗ Error saving ${artwork.title}:`, error);
        }
      }
    }
  }

  async runFullScrape() {
    console.log('🚀 Starting Art & Photography scraper...\n');

    const allArtworks: ScrapedArtwork[] = [];

    try {
      // Scrape Colossal
      const colossalArtworks = await this.scrapeColossal(5);
      allArtworks.push(...colossalArtworks);
      await this.sleep(this.rateLimit);

      // Scrape Feature Shoot
      const featureShootArtworks = await this.scrapeFeatureShoot(5);
      allArtworks.push(...featureShootArtworks);
      await this.sleep(this.rateLimit);

    } catch (error) {
      console.error('Scraping error:', error);
    }

    console.log(`\n📊 Total artworks scraped: ${allArtworks.length}`);

    if (allArtworks.length > 0) {
      await this.saveToDatabase(allArtworks);
    }

    console.log('\n✅ Scraping complete!');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new ArtScraper();

  scraper.runFullScrape()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Scraper failed:', error);
      process.exit(1);
    });
}

export default ArtScraper;
