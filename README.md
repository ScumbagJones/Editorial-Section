# Enamorado - Editorial Section

A modern digital magazine platform for San Antonio creatives featuring editorial content and community submissions.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation
1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your database connection in `.env` file
4. Start the development server:
   ```bash
   npm run dev
   ```

### Features
- **Editorial Content**: Curated featured stories with real Substack integration
- **Community Submissions**: Multi-step submission form for various content types
- **Admin Dashboard**: Editorial review and content management
- **Responsive Design**: Mobile-friendly magazine-style layouts

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas

### Using in VS Code
1. Open the project folder in VS Code
2. Install recommended extensions when prompted
3. Use the integrated terminal to run `npm run dev`
4. Open `http://localhost:5000` in your browser

## Part of Larger Project
This editorial section is part of a larger "Enamorado" project that will include:
- Radio player (next phase)
- Home page integration (final phase)

## Sharing with Friends
This project is ready for feedback! The main features to show:
- Homepage with featured articles
- Submission forms (/submit/poetry, /submit/art, etc.)
- Clean editorial aesthetic inspired by pi.fyi and Vogue