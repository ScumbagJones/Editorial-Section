# 🚀 Quick Start: Web Scraping Setup

Get your editorial platform populated with high-quality content in 5 minutes!

## 1️⃣ Install Dependencies

```bash
npm install
```

This will install:
- `xml2js` - For parsing Substack RSS feeds
- `cheerio` - For scraping HTML content
- `@types/xml2js` - TypeScript definitions

## 2️⃣ Choose Your Scraping Strategy

### Option A: Featured Stories (Auto-Publish)
Scrapes Substack articles directly to your homepage:

```bash
npm run scrape:substack
```

**Result:** Articles appear immediately on homepage as featured stories

### Option B: Editorial Review (Recommended)
Scrapes art/photo content for editorial review:

```bash
npm run scrape:art
```

**Result:** Content goes to admin dashboard for approval (status: pending)

### Option C: Run Everything
```bash
npm run scrape:all
```

## 3️⃣ Review & Publish

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit admin dashboard:
   ```
   http://localhost:5000/admin
   ```

3. Approve high-quality submissions

4. View on homepage:
   ```
   http://localhost:5000
   ```

---

## 📋 What Gets Scraped?

### Substack Scraper
**Sources:**
- Dirt (newsletter culture)
- Kyle Chayka (culture criticism)
- Blood Knife (art/culture)

**Data captured:**
- Article title
- Author name
- Publication date
- Excerpt (first 2-3 sentences)
- Featured image
- Link to original article

### Art/Photography Scraper
**Sources:**
- Colossal (contemporary art)
- Feature Shoot (photography)

**Data captured:**
- Artwork/project title
- Artist/photographer name
- Description
- Featured image
- Link to original source

---

## 🎨 Customize Sources

### Add Your Own Substack

Edit `scrapers/substack-scraper.ts`:

```typescript
const SUBSTACK_SOURCES = [
  // Add your favorite Substacks here:
  {
    url: 'https://your-favorite.substack.com/feed',
    name: 'Your Favorite Newsletter',
    category: 'conversation', // 'art' | 'fashion' | 'photography' | 'conversation'
    section: 'editorial'
  },
];
```

### Add San Antonio Local Content

For San Antonio Current or local blogs:

```typescript
{
  url: 'https://www.sacurrent.com/feed',
  name: 'San Antonio Current',
  category: 'conversation',
  section: 'community' // Shows up in community section
}
```

---

## ⚙️ Automation (Optional)

### Run Daily at 2 AM

**Option 1: Node Cron (In-App)**

Install: `npm install node-cron`

Create `scrapers/scheduler.ts`:
```typescript
import cron from 'node-cron';
import SubstackScraper from './substack-scraper';

cron.schedule('0 2 * * *', async () => {
  const scraper = new SubstackScraper();
  await scraper.runFullScrape('featured');
});
```

**Option 2: System Cron (Mac/Linux)**

```bash
crontab -e
```

Add:
```
0 2 * * * cd /path/to/Editorial-Section && npm run scrape:all
```

---

## 🛡️ Legal & Ethical

All scrapers follow best practices:
- ✅ Use public RSS feeds when available
- ✅ Respect robots.txt
- ✅ Rate limiting (2-3 seconds between requests)
- ✅ Proper attribution (author, date, link)
- ✅ User-Agent identification
- ✅ Only public content

**What we DON'T do:**
- ❌ Scrape paywalled content
- ❌ Remove attribution
- ❌ Republish full articles
- ❌ Ignore rate limits

---

## 📊 Database Schema Mapping

### Scraped content uses your existing schema:

```typescript
// Featured Stories (Substack)
{
  title: "Article Title",
  excerpt: "First 2-3 sentences...",
  author: "Author Name",
  category: "conversation",
  imageUrl: "https://...",
  externalUrl: "https://original-article.com",
  isActive: true,
  isFeatured: false // Manually curate later
}

// Submissions (Art/Photo)
{
  title: "Artwork Title",
  description: "Description...",
  submitterHandle: "Artist Name",
  category: "art" | "photography",
  contentType: "mixed",
  originalAuthor: "Artist Name",
  originalDate: new Date(),
  substackUrl: null,
  status: "pending", // Requires approval
  section: "editorial",
  files: ["image-url.jpg"]
}
```

---

## 🎯 Next Steps

1. **Run your first scrape:** `npm run scrape:all`
2. **Review content:** Check `/admin` dashboard
3. **Customize sources:** Add your favorite Substacks/art sites
4. **Automate:** Set up daily cron job
5. **Monitor:** Check scraper logs for errors

---

## 🆘 Troubleshooting

**"Cannot find module 'xml2js'"**
```bash
npm install xml2js @types/xml2js
```

**"Database connection failed"**
Check your `.env` file has `DATABASE_URL` set

**"No content appearing"**
1. Check console for scraper output
2. Verify database connection
3. Check if content already exists (duplicates skipped)

**"HTTP 429 Too Many Requests"**
Increase rate limit in scraper files (change `rateLimit: 2000` to `5000`)

---

## 📚 Full Documentation

For detailed customization, legal considerations, and advanced features:
- 📖 [SCRAPING-TARGETS.md](./SCRAPING-TARGETS.md) - 50+ curated sources
- 📖 [scrapers/README.md](./scrapers/README.md) - Technical docs

---

**Ready to populate your platform with amazing content? Run `npm run scrape:all` now! 🎨**
