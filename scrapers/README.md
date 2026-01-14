# Web Scrapers for Editorial Platform

This directory contains web scrapers that populate your editorial platform with high-quality content from curated sources.

## 📁 Available Scrapers

### 1. `substack-scraper.ts` - Substack RSS Feed Scraper
**Sources:**
- Dirt (newsletter culture)
- Kyle Chayka (culture criticism)
- Blood Knife (art/culture)

**Output:** Featured stories or submissions table
**Legal:** ✅ Uses public RSS feeds (intended for syndication)
**Rate:** 2 seconds between requests

### 2. `art-scraper.ts` - Art & Photography Scraper
**Sources:**
- Colossal (contemporary art)
- Feature Shoot (photography)

**Output:** Submissions table (status: pending)
**Legal:** ⚠️  Web scraping - respect robots.txt
**Rate:** 3 seconds between requests

---

## 🚀 Setup

### Install Dependencies

```bash
npm install xml2js cheerio
npm install -D @types/xml2js
```

### Configure Database
Ensure your `.env` file has the correct database connection:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/enamorado
```

---

## 🎯 Usage

### Run Individual Scrapers

**Substack scraper (saves to featured_stories):**
```bash
npx tsx scrapers/substack-scraper.ts
```

**Art scraper (saves to submissions for review):**
```bash
npx tsx scrapers/art-scraper.ts
```

### Schedule with Cron

Add to your `package.json`:
```json
{
  "scripts": {
    "scrape:substack": "tsx scrapers/substack-scraper.ts",
    "scrape:art": "tsx scrapers/art-scraper.ts",
    "scrape:all": "npm run scrape:substack && npm run scrape:art"
  }
}
```

Then run:
```bash
npm run scrape:all
```

### Automated Scheduling (Production)

**Option 1: Node-cron (in-app scheduling)**

Install: `npm install node-cron`

Create `scrapers/scheduler.ts`:
```typescript
import cron from 'node-cron';
import SubstackScraper from './substack-scraper';
import ArtScraper from './art-scraper';

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('🕐 Running daily scrape...');

  const substackScraper = new SubstackScraper();
  await substackScraper.runFullScrape('featured');

  const artScraper = new ArtScraper();
  await artScraper.runFullScrape();

  console.log('✅ Daily scrape complete!');
});

console.log('🤖 Scraper scheduler started');
```

**Option 2: System Cron (Linux/Mac)**

```bash
crontab -e
```

Add:
```
0 2 * * * cd /path/to/Editorial-Section && npm run scrape:all >> /var/log/scraper.log 2>&1
```

**Option 3: GitHub Actions (free, cloud-based)**

Create `.github/workflows/scraper.yml`:
```yaml
name: Daily Content Scraper

on:
  schedule:
    - cron: '0 2 * * *' # 2 AM UTC daily
  workflow_dispatch: # Allow manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run scrape:all
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 🎨 Customization

### Adding New Substack Sources

Edit `substack-scraper.ts`:

```typescript
const SUBSTACK_SOURCES = [
  {
    url: 'https://your-substack.substack.com/feed',
    name: 'Your Substack',
    category: 'conversation', // 'art' | 'fashion' | 'photography' | 'conversation'
    section: 'editorial'      // 'editorial' | 'community' | 'voices'
  },
];
```

### Adding New Art/Photo Sites

Edit `art-scraper.ts`:

```typescript
const SOURCES = {
  yourSite: {
    name: 'Your Site',
    baseUrl: 'https://example.com',
    listingUrl: 'https://example.com/articles',
    category: 'art', // or 'photography' | 'mixed'
    selectors: {
      articles: '.article-list article',  // CSS selector for article containers
      title: 'h2.title',                  // CSS selector for title
      link: 'a.permalink',                // CSS selector for article link
      image: 'img.featured',              // CSS selector for featured image
      excerpt: '.summary',                // CSS selector for excerpt/description
    }
  }
};
```

Then add to `runFullScrape()`:
```typescript
const yourSiteArtworks = await this.scrapeYourSite(5);
allArtworks.push(...yourSiteArtworks);
await this.sleep(this.rateLimit);
```

---

## ⚖️ Legal & Ethical Guidelines

### ✅ Always Do:
- Respect `robots.txt` files
- Include identifying User-Agent headers
- Add delays between requests (minimum 2 seconds)
- Only scrape publicly available content
- Store proper attribution (author, originalUrl)
- Link back to original sources
- Prefer RSS feeds and APIs when available

### ⚠️ Check First:
- Read the site's Terms of Service
- Look for "No Scraping" clauses
- Check if they offer an official API
- Verify copyright on images

### 🚫 Never Do:
- Scrape paywalled content
- Remove watermarks or attribution
- Republish full articles without permission
- Make rapid-fire requests (DDoS)
- Ignore robots.txt
- Hotlink images (store them properly)

---

## 🛠️ Troubleshooting

### "Cannot find module 'xml2js'"
```bash
npm install xml2js @types/xml2js
```

### "Cannot find module 'cheerio'"
```bash
npm install cheerio
```

### "Database connection failed"
Check your `.env` file has `DATABASE_URL` set correctly.

### "HTTP 429 Too Many Requests"
You're being rate-limited. Increase the `rateLimit` value in the scraper (e.g., from 2000 to 5000).

### "HTTP 403 Forbidden"
The site is blocking your User-Agent. Try:
1. Update the User-Agent string
2. Add more request headers (Accept, Referer)
3. Check if the site has an API instead

### "Duplicate key error (23505)"
This is normal - it means the content already exists in your database. The scraper will skip duplicates.

---

## 📊 Monitoring Scraped Content

### View Pending Submissions (Admin Dashboard)

All scraped art/photo content goes to `submissions` with `status: 'pending'`. Review them at:
```
http://localhost:5000/admin
```

### View Featured Stories

Substack content (by default) goes directly to `featured_stories` with `isActive: true` and `isFeatured: false`. Manually curate which ones to feature on the homepage.

### Query Scraped Content

```sql
-- View all scraped content from external sources
SELECT * FROM submissions
WHERE submitter_handle = 'Editorial'
ORDER BY created_at DESC;

-- Count by source
SELECT original_author, COUNT(*)
FROM submissions
WHERE section = 'editorial'
GROUP BY original_author;
```

---

## 🎯 Best Practices

1. **Start Small**: Begin with 5 articles per source, then increase
2. **Review First**: Always set scraped content to `status: 'pending'`
3. **Add Attribution**: Use `originalAuthor`, `originalDate`, `externalUrl` fields
4. **Store Images Properly**: Don't hotlink - upload to Cloudinary
5. **Monitor Quality**: Regularly check scraped content for accuracy
6. **Update Selectors**: Websites change their HTML - scrapers need maintenance
7. **Respect Sources**: Add a "Sources" page crediting platforms you scrape

---

## 🔄 Next Steps

1. **Build an image upload pipeline** - Download images and upload to Cloudinary instead of storing external URLs
2. **Add deduplication logic** - Check if content already exists before saving
3. **Create a scraper health check** - Monitor which scrapers are failing
4. **Build email notifications** - Alert you when new content is scraped
5. **Add content quality filters** - Only save articles above a certain word count
6. **Create a "Sources" page** - Credit the platforms you're scraping

---

## 🤝 Contributing New Scrapers

When adding a new scraper:

1. Create a new file: `scrapers/your-source-scraper.ts`
2. Extend the base pattern (see existing scrapers)
3. Add rate limiting (minimum 2 seconds)
4. Include proper error handling
5. Save to `status: 'pending'` for review
6. Document in this README
7. Test with a small limit first (e.g., 3 articles)

---

## 📝 Example Workflow

```bash
# Morning: Scrape fresh content
npm run scrape:all

# Review scraped content in admin dashboard
open http://localhost:5000/admin

# Approve high-quality submissions
# (Click "Approve" in admin interface)

# Featured stories appear on homepage automatically
# Approved submissions appear in community section
```

---

## 🆘 Need Help?

- Check existing scraper code for patterns
- Test individual CSS selectors in browser DevTools
- Use browser's Network tab to inspect API calls
- Look for RSS feeds first (easier than HTML scraping)
- Consider official APIs before building scrapers

Happy scraping! 🎨
