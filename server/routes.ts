import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertSubmissionSchema, updateSubmissionStatusSchema } from "@shared/schema";

// WebSocket clients storage
const wsClients = new Set<any>();

// Global broadcast function
declare global {
  var broadcast: (type: string, data: any) => void;
}

global.broadcast = (type: string, data: any) => {
  const message = JSON.stringify({ type, ...data });
  wsClients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(message);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        wsClients.delete(client);
      }
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Submissions endpoints
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      // Broadcast new submission to all connected clients
      global.broadcast('new_submission', { submission });
      
      res.json(submission);
    } catch (error) {
      res.status(400).json({ error: "Invalid submission data" });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const submissions = await storage.getSubmissions(status);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/submissions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateSubmissionStatusSchema.parse(req.body);
      const submission = await storage.updateSubmissionStatus(id, validatedData);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(400).json({ error: "Invalid status update data" });
    }
  });

  app.post("/api/submissions/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reviewedBy } = req.body;
      
      if (!reviewedBy) {
        return res.status(400).json({ error: "Reviewer name is required" });
      }

      const submission = await storage.approveSubmission(id, reviewedBy);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  // Content moderation endpoint
  app.post("/api/submissions/:id/moderate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const submission = await storage.updateSubmissionStatus(id, updateData);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to moderate submission" });
    }
  });

  // Like/Unlike submission
  app.post("/api/submissions/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      const updatedSubmission = await storage.updateSubmissionStatus(id, { 
        likes: submission.likes + 1 
      });
      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ error: "Failed to like submission" });
    }
  });

  app.get("/api/community-submissions", async (req, res) => {
    try {
      const submissions = await storage.getApprovedSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching community submissions:", error);
      res.status(500).json({ error: "Failed to fetch community submissions" });
    }
  });

  app.get("/api/editorial-submissions", async (req, res) => {
    try {
      const submissions = await storage.getEditorialSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching editorial submissions:", error);
      res.status(500).json({ error: "Failed to fetch editorial submissions" });
    }
  });

  // Featured stories endpoints
  app.get("/api/featured-stories", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured stories" });
    }
  });

  // Stats endpoints for admin dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const allSubmissions = await storage.getSubmissions();
      const pending = allSubmissions.filter(s => s.status === "pending").length;
      const approved = allSubmissions.filter(s => s.status === "approved").length;
      const totalViews = allSubmissions.reduce((sum, s) => sum + (s.likes || 0), 0);
      const contributors = new Set(allSubmissions.map(s => s.submitterHandle)).size;

      res.json({
        pending,
        approved,
        totalViews,
        contributors
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    wsClients.add(ws);

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      wsClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsClients.delete(ws);
    });
  });

  return httpServer;
}
