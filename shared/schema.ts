import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  submitterHandle: text("submitter_handle").notNull(),
  submitterEmail: text("submitter_email"),
  socialHandle: text("social_handle"), // @username from Instagram/Twitter
  category: text("category").notNull(), // 'conversation', 'creative-work', 'local-moment', 'quick-share'
  contentType: text("content_type").notNull().default("text"), // 'text', 'substack', 'video', 'audio', 'mixed', 'playlist'
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  files: text("files").array().default([]), // Array of file URLs
  collaborationLinks: text("collaboration_links").array().default([]), // Substack, YouTube, Google Docs, etc.
  substackUrl: text("substack_url"), // Direct Substack article URL for dynamic pulling
  externalPlatform: text("external_platform"), // 'substack', 'youtube', 'vimeo', 'soundcloud', etc.
  originalExcerpt: text("original_excerpt"), // First 2-3 sentences from original content
  originalAuthor: text("original_author"), // Original author name
  originalDate: timestamp("original_date"), // Original publication date
  likes: integer("likes").default(0),
  
  // Community-friendly moderation
  editorialStatus: text("editorial_status").default("pending"), // 'ready', 'needs_edits', 'not_suitable'
  feedbackNotes: text("feedback_notes"), // Constructive feedback for improvement
  isCommunityVoice: boolean("is_community_voice").default(false), // Different standards for community stories
  section: text("section").default("community"), // 'editorial', 'community', 'voices'
  
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add tags table for better categorization
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // 'genre', 'editorial', 'status', 'internal'
  isPublic: boolean("is_public").default(true), // Hide internal tags like 'Radio Ready'
});

export const submissionTags = pgTable("submission_tags", {
  submissionId: integer("submission_id").references(() => submissions.id),
  tagId: integer("tag_id").references(() => tags.id),
});

export const featuredStories = pgTable("featured_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  externalUrl: text("external_url"), // Link to original Substack article
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  reviewedSubmissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  reviewer: one(users, {
    fields: [submissions.reviewedBy],
    references: [users.username],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  status: true,
  likes: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
}).extend({
  substackUrl: z.string().optional(),
  // Community-friendly validation
  title: z.string().min(3, "Please add a title").max(100, "Title is a bit too long"),
  description: z.string().min(10, "Tell us a bit more about your work").max(1000, "Description is too long"),
  submitterHandle: z.string().min(2, "Please add your name or handle").max(30, "Handle is too long"),
  submitterEmail: z.string().email("Please enter a valid email").optional(),
  socialHandle: z.string().max(50, "Social handle is too long").optional(),
  category: z.enum(["art", "fashion", "photography", "mixed"], {
    message: "Please select a valid category"
  }),
  collaborationLinks: z.array(z.string().url("Must be a valid URL")).optional(),
});

export const insertFeaturedStorySchema = createInsertSchema(featuredStories).omit({
  id: true,
  createdAt: true,
});

export const updateSubmissionStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  reviewedBy: z.string().optional(),
  editorialStatus: z.enum(["pending", "ready", "needs_edits", "not_suitable"]).optional(),
  feedbackNotes: z.string().optional(),
  section: z.enum(["editorial", "community", "voices"]).optional(),
  isCommunityVoice: z.boolean().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type FeaturedStory = typeof featuredStories.$inferSelect;
export type InsertFeaturedStory = z.infer<typeof insertFeaturedStorySchema>;
export type UpdateSubmissionStatus = z.infer<typeof updateSubmissionStatusSchema>;
