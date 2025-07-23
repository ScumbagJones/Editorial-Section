import { 
  users, 
  submissions, 
  featuredStories,
  type User, 
  type InsertUser,
  type Submission,
  type InsertSubmission,
  type FeaturedStory,
  type InsertFeaturedStory,
  type UpdateSubmissionStatus
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(status?: string): Promise<Submission[]>;
  getSubmissionById(id: number): Promise<Submission | undefined>;
  updateSubmissionStatus(id: number, update: UpdateSubmissionStatus): Promise<Submission | undefined>;
  approveSubmission(id: number, reviewedBy: string): Promise<Submission | undefined>;
  getApprovedSubmissions(): Promise<Submission[]>;
  getEditorialSubmissions(): Promise<Submission[]>;
  
  // Featured stories methods
  getFeaturedStories(): Promise<FeaturedStory[]>;
  createFeaturedStory(story: InsertFeaturedStory): Promise<FeaturedStory>;
  updateFeaturedStory(id: number, story: Partial<FeaturedStory>): Promise<FeaturedStory | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private submissions: Map<number, Submission>;
  private featuredStories: Map<number, FeaturedStory>;
  private currentUserId: number;
  private currentSubmissionId: number;
  private currentStoryId: number;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.featuredStories = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
    this.currentStoryId = 1;
    
    // Initialize with some featured stories
    this.initializeFeaturedStories();
  }

  private initializeFeaturedStories() {
    const stories: InsertFeaturedStory[] = [
      {
        title: "Imagining Tomorrow",
        excerpt: "10th Anniversary Edition featuring community culture, independent voices, and the art that defines our generation.",
        author: "Editorial Team",
        category: "Culture",
        isActive: true,
        isFeatured: true,
      },
      {
        title: "Creative Voices",
        excerpt: "Exploring the intersection of art, culture, and community through emerging artists and independent creators.",
        author: "Community Contributors",
        category: "Art",
        isActive: true,
        isFeatured: false,
      },
      {
        title: "Sound Stories",
        excerpt: "Discovering local music scenes and the artists shaping our cultural landscape.",
        author: "Music Editorial",
        category: "Music",
        isActive: true,
        isFeatured: false,
      }
    ];

    stories.forEach(story => this.createFeaturedStory(story));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Submission methods
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = {
      ...insertSubmission,
      id,
      status: "pending",
      likes: 0,
      reviewedBy: null,
      reviewedAt: null,
      feedbackNotes: null,
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissions(status?: string): Promise<Submission[]> {
    const allSubmissions = Array.from(this.submissions.values());
    if (status) {
      return allSubmissions.filter(s => s.status === status);
    }
    return allSubmissions.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async updateSubmissionStatus(id: number, update: UpdateSubmissionStatus): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;

    const updatedSubmission: Submission = {
      ...submission,
      status: update.status,
      reviewedBy: update.reviewedBy || submission.reviewedBy,
      feedbackNotes: update.feedbackNotes || submission.feedbackNotes,
      reviewedAt: new Date(),
    };

    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async approveSubmission(id: number, reviewedBy: string): Promise<Submission | undefined> {
    return this.updateSubmissionStatus(id, {
      status: "approved",
      reviewedBy,
    });
  }

  async getApprovedSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(s => s.status === "approved")
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getEditorialSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(s => s.section === "editorial" && s.status === "approved")
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  // Featured stories methods
  async getFeaturedStories(): Promise<FeaturedStory[]> {
    return Array.from(this.featuredStories.values())
      .filter(s => s.isActive)
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      });
  }

  async createFeaturedStory(insertStory: InsertFeaturedStory): Promise<FeaturedStory> {
    const id = this.currentStoryId++;
    const story: FeaturedStory = {
      ...insertStory,
      id,
      createdAt: new Date(),
    };
    this.featuredStories.set(id, story);
    return story;
  }

  async updateFeaturedStory(id: number, updates: Partial<FeaturedStory>): Promise<FeaturedStory | undefined> {
    const story = this.featuredStories.get(id);
    if (!story) return undefined;

    const updatedStory: FeaturedStory = { ...story, ...updates };
    this.featuredStories.set(id, updatedStory);
    return updatedStory;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db
      .insert(submissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getSubmissions(status?: string): Promise<Submission[]> {
    if (status) {
      return await db.select().from(submissions).where(eq(submissions.status, status));
    }
    return await db.select().from(submissions);
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission || undefined;
  }

  async updateSubmissionStatus(id: number, update: UpdateSubmissionStatus): Promise<Submission | undefined> {
    const [submission] = await db
      .update(submissions)
      .set({
        status: update.status,
        reviewedBy: update.reviewedBy,
        editorialStatus: update.editorialStatus,
        feedbackNotes: update.feedbackNotes,
        section: update.section,
        isCommunityVoice: update.isCommunityVoice,
        reviewedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();
    return submission || undefined;
  }

  async approveSubmission(id: number, reviewedBy: string): Promise<Submission | undefined> {
    const [submission] = await db
      .update(submissions)
      .set({
        status: "approved",
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();
    return submission || undefined;
  }

  async getApprovedSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.status, "approved"));
  }

  async getEditorialSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.section, "editorial"));
  }

  async getFeaturedStories(): Promise<FeaturedStory[]> {
    return await db.select().from(featuredStories).where(eq(featuredStories.isActive, true));
  }

  async createFeaturedStory(insertStory: InsertFeaturedStory): Promise<FeaturedStory> {
    const [story] = await db
      .insert(featuredStories)
      .values(insertStory)
      .returning();
    return story;
  }

  async updateFeaturedStory(id: number, updates: Partial<FeaturedStory>): Promise<FeaturedStory | undefined> {
    const [story] = await db
      .update(featuredStories)
      .set(updates)
      .where(eq(featuredStories.id, id))
      .returning();
    return story || undefined;
  }
}

export const storage = new DatabaseStorage();
