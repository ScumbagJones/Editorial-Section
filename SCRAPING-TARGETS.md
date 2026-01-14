# Web Scraping Targets for Editorial Platform

## Overview
This document lists high-quality websites to scrape for your editorial platform, organized by content type and mapped to your database schema.

---

## 🎨 Editorial Magazines & Zines (Featured Stories)

### High Priority - Editorial Content

**Polyester Zine** - https://polyesterzine.com
- **Content**: Art, fashion, photography editorials
- **Extract**: Article title, excerpt, author, featured image, external URL
- **Maps to**: `featuredStories` table
- **Why**: Direct inspiration source, aesthetic matches your vision
- **Scraping approach**: Article listings, individual article pages

**i-D Magazine** - https://i-d.vice.com
- **Content**: Fashion, music, art, youth culture
- **Extract**: Headlines, cover images, article metadata
- **Maps to**: `featuredStories` table
- **Note**: Respect rate limits, Vice has anti-scraping measures

**Dazed Digital** - https://www.dazeddigital.com
- **Content**: Fashion, art, music editorials
- **Extract**: Article titles, authors, categories, imagery
- **Maps to**: `featuredStories` table

**Office Magazine** - https://officemagazine.net
- **Content**: Contemporary art and culture
- **Extract**: Exhibition reviews, artist features, editorials
- **Maps to**: `featuredStories` table (category: 'art')

**SSENSE Editorial** - https://www.ssense.com/en-us/editorial
- **Content**: Fashion essays, photography series
- **Extract**: Editorial titles, photographers, styling credits
- **Maps to**: `featuredStories` table (category: 'fashion')

---

## 📝 Substack & Independent Writers (Community Submissions)

### Direct Substack Integration

**Top Culture/Art Substacks to Monitor:**
1. **Dirt** - https://dirt.substack.com (Newsletter culture)
2. **The Creative Independent** - https://thecreativeindependent.com
3. **Kyle Chayka** - https://kyleschayka.substack.com (Culture criticism)
4. **Blood Knife** - https://bloodknife.com (Art/culture)
5. **Embedded** - https://embedded.substack.com (Internet culture)

**Scraping Strategy:**
- Use Substack's RSS feeds: `https://[subdomain].substack.com/feed`
- Extract: `title`, `author`, `excerpt`, `externalUrl`, `originalDate`
- Maps to: `submissions` table with `contentType: 'substack'`
- Store `substackUrl` for dynamic pulling

**Code hint for your backend:**
```typescript
// Substack RSS parsing
const substackFeed = `https://${subdomain}.substack.com/feed`;
// Extract: title, pubDate, link, content:encoded, dc:creator
```

---

## 🖼️ Art & Photography Platforms

**Artforum** - https://www.artforum.com
- **Content**: Exhibition reviews, artist interviews, criticism
- **Extract**: Review titles, images, artist names, gallery info
- **Maps to**: `submissions` (category: 'art')

**Artnet News** - https://news.artnet.com
- **Content**: Contemporary art news, market reports
- **Extract**: Headlines, featured images, artist profiles
- **Maps to**: `featuredStories` or `submissions`

**Colossal** - https://www.thisiscolossal.com
- **Content**: Art, design, photography features
- **Extract**: Project titles, artist names, high-res images
- **Maps to**: `submissions` (category: 'art', 'photography')
- **Why**: Very scrapable structure, community-focused

**It's Nice That** - https://www.itsnicethat.com
- **Content**: Creative work across disciplines
- **Extract**: Project titles, creators, categories, images
- **Maps to**: `submissions` (category: 'creative-work')

**Behance** - https://www.behance.net
- **Content**: Portfolio projects (design, photography, illustration)
- **Extract**: Project title, creator, tags, cover image
- **Maps to**: `submissions` with `socialHandle` from Behance username
- **API Available**: Yes - use Behance API for cleaner data

---

## 📸 Photography-Specific

**Feature Shoot** - https://www.featureshoot.com
- **Content**: Photography editorials and artist features
- **Extract**: Photographer names, series titles, imagery
- **Maps to**: `submissions` (category: 'photography')

**Lenscratch** - https://lenscratch.com
- **Content**: Contemporary photography
- **Extract**: Daily features, artist statements
- **Maps to**: `submissions` (category: 'photography')

**Phroom Magazine** - https://www.phroommagazine.com
- **Content**: Photography portfolios and editorials
- **Extract**: Photographer profiles, project descriptions
- **Maps to**: `featuredStories` or `submissions`

---

## 🎭 Poetry & Writing

**Poetry Foundation** - https://www.poetryfoundation.org
- **Content**: Poems, poet biographies, articles
- **Extract**: Poem titles, authors, text content
- **Maps to**: `submissions` (category: 'conversation', contentType: 'text')
- **Note**: Respect copyright - only scrape metadata/excerpts

**poets.org** (Academy of American Poets) - https://poets.org
- **Content**: Poem of the Day, poet profiles
- **Extract**: Titles, excerpts (2-3 lines max), poet names
- **Maps to**: `submissions` with `originalExcerpt` field

**The Paris Review** - https://www.theparisreview.org
- **Content**: Essays, poetry, interviews
- **Extract**: Titles, authors, first paragraphs
- **Maps to**: `featuredStories` (category: 'conversation')

---

## 🌎 Local San Antonio Content

**San Antonio Current** - https://www.sacurrent.com
- **Content**: Local arts, music, events
- **Extract**: Event listings, art reviews, local artist features
- **Maps to**: `submissions` (category: 'local-moment')

**Heron Contributor** - https://heroncontributor.com
- **Content**: San Antonio literary journal
- **Extract**: Author names, essay titles, excerpts
- **Maps to**: `submissions` (section: 'community')

**SA Flavor** - https://www.saflavor.com
- **Content**: Local culture, events, interviews
- **Extract**: Event details, artist profiles
- **Maps to**: `submissions` (category: 'local-moment')

---

## 🎵 Music & Culture (for future Radio integration)

**The FADER** - https://www.thefader.com
- **Content**: Music features, artist interviews
- **Extract**: Article titles, artist names, genres
- **Future use**: Radio playlists, artist features

**Resident Advisor** - https://ra.co
- **Content**: Electronic music, DJ culture, events
- **Extract**: Event listings, artist reviews
- **Future use**: Local music events integration

**Pitchfork** - https://pitchfork.com
- **Content**: Music reviews, features, news
- **Extract**: Review scores, album metadata, editorial content
- **Maps to**: `submissions` (category: 'conversation')

---

## 🔗 Recommendation Networks (PI.FYI Style)

**Are.na** - https://www.are.na
- **Content**: Community-curated collections of images, links, ideas
- **Extract**: Channel titles, block content, user connections
- **Maps to**: Custom recommendation graph logic
- **API Available**: Yes - use Are.na API
- **Why**: Perfect for understanding recommendation patterns

**Savee** - https://savee.it
- **Content**: Design and image curation platform
- **Extract**: Collection titles, tags, user follows
- **Maps to**: User recommendation relationships

---

## 🛠️ Technical Implementation Guide

### Scraping Stack Recommendation

```bash
# Python approach (recommended for your Node.js backend)
pip install beautifulsoup4 requests scrapy playwright

# Node.js approach (integrates directly)
npm install cheerio axios puppeteer
```

### Sample Scraper Structure for Your Schema

```typescript
// Example: Scraping article into featuredStories
interface ScrapedArticle {
  title: string;
  excerpt: string;
  author: string;
  category: 'art' | 'fashion' | 'photography' | 'conversation';
  imageUrl?: string;
  externalUrl: string;
  originalDate?: Date;
}

// Maps directly to insertFeaturedStorySchema
```

### Legal & Ethical Considerations

**✅ Good practices:**
- Respect `robots.txt` files
- Add delays between requests (1-2 seconds minimum)
- Include User-Agent headers identifying your bot
- Only scrape publicly available content
- Store attribution (author, original URL)
- Use RSS feeds when available (cleaner, intended for sharing)

**⚠️ Check Terms of Service:**
- Polyester, i-D, Dazed - May have anti-scraping clauses
- Substack - Has API, prefer that for integration
- Behance, Are.na - Have official APIs, use those instead

**🚫 Avoid:**
- Scraping paywalled content
- Removing watermarks from images
- Republishing full articles without permission
- High-frequency requests that could DDoS

### Rate Limiting Example

```typescript
// Add to your scraper
const RATE_LIMIT_MS = 2000; // 2 seconds between requests
await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS));
```

---

## 📊 Priority Ranking for Your Use Case

### Week 1: Get Editorial Content
1. **Colossal** - Easy to scrape, great imagery
2. **Substack RSS feeds** - Use API/RSS, clean data
3. **It's Nice That** - Community-focused, scrapable

### Week 2: Build Community Data
4. **Are.na API** - Recommendation patterns
5. **Behance API** - Creative portfolios
6. **San Antonio Current** - Local content

### Week 3: Premium Editorial
7. **Polyester** (carefully) - Your aesthetic inspiration
8. **Feature Shoot** - Photography focus
9. **Poetry Foundation** - Literary content

---

## 🎯 Mapping to Your Database Schema

### For `featuredStories` table:
```typescript
{
  title: scraped.headline,
  excerpt: scraped.firstParagraph.slice(0, 300),
  author: scraped.byline,
  category: mapCategory(scraped.section), // 'art'|'fashion'|'photography'
  imageUrl: scraped.featuredImage,
  externalUrl: scraped.canonicalUrl,
  isFeatured: false, // Manually curate later
  isActive: true
}
```

### For `submissions` table (community content):
```typescript
{
  title: scraped.title,
  description: scraped.excerpt,
  submitterHandle: scraped.author || 'Editorial',
  category: mapToCategory(scraped.tags), // 'art'|'fashion'|etc
  contentType: 'text' | 'substack' | 'mixed',
  substackUrl: scraped.url, // If from Substack
  originalAuthor: scraped.author,
  originalDate: new Date(scraped.publishDate),
  originalExcerpt: scraped.excerpt.slice(0, 200),
  status: 'pending', // Review before publishing
  section: 'editorial',
  files: scraped.images || []
}
```

---

## 🚀 Next Steps

1. **Start with RSS feeds** - Easiest, legal, intended for syndication
2. **Use official APIs** when available (Substack, Behance, Are.na)
3. **Build a scraper service** - Separate from main app, runs on schedule
4. **Add admin review** - All scraped content goes to `status: 'pending'`
5. **Respect rate limits** - Build slow, sustainable scrapers
6. **Monitor for changes** - Websites update their HTML frequently

---

## 📝 Notes

- Focus on **metadata and excerpts**, not full content republishing
- Your `originalAuthor`, `originalDate`, and `externalUrl` fields are perfect for attribution
- Consider building a "Sources" page crediting platforms you scrape
- For images, use Cloudinary URLs from your stack - don't hotlink scraped images
- The `isCommunityVoice` flag is great for distinguishing scraped vs. user-submitted content

Would you like me to build a sample scraper for any specific site?
