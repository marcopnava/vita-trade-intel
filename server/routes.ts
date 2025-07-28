import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertUserSchema, insertClientSchema, insertTradeSchema, insertProposalSchema } from "../shared/schema";
import { taskScheduler } from "./scheduler/taskScheduler";
import { marketDataFetcher } from "./data/dataFetcher";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with seed data on first run
  try {
    await seedDatabase();
    
    // Start the market data scheduler
    taskScheduler.startScheduler();
    console.log("✅ Market data scheduler started");
  } catch (error) {
    console.log("Database seeding skipped or failed:", error);
  }

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In production, properly verify password hash
      // For now, accepting any password for demo purposes
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          votes: user.votes
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // In production, hash the password properly
      const user = await storage.createUser({
        ...userData,
        password: `hashed_${userData.password}` // Placeholder for proper hashing
      });

      res.status(201).json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          votes: user.votes
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Client management routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Get clients error:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Create client error:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Trade management routes
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getTrades();
      res.json(trades);
    } catch (error) {
      console.error("Get trades error:", error);
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const tradeData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade(tradeData);
      res.status(201).json(trade);
    } catch (error) {
      console.error("Create trade error:", error);
      res.status(500).json({ error: "Failed to create trade" });
    }
  });

  // Proposal management routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Get proposals error:", error);
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Create proposal error:", error);
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  // Chat message routes
  app.get("/api/chat/:channel", async (req, res) => {
    try {
      const { channel } = req.params;
      const messages = await storage.getChatMessages(channel);
      res.json(messages);
    } catch (error) {
      console.error("Get chat messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { content, channel, userId } = req.body;
      
      if (!content || !channel || !userId) {
        return res.status(400).json({ error: "Content, channel, and userId required" });
      }

      const message = await storage.createChatMessage({
        content,
        channel,
        userId: parseInt(userId),
        type: 'text'
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Create chat message error:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Alert routes
  app.get("/api/alerts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const alerts = await storage.getAlertsByUser(parseInt(userId));
      res.json(alerts);
    } catch (error) {
      console.error("Get alerts error:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Market data endpoints
  app.get("/api/market/prices", async (req, res) => {
    try {
      const { symbol, timeframe, limit } = req.query;
      const prices = await storage.getPrices(
        symbol as string, 
        timeframe as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(prices);
    } catch (error) {
      console.error("Get prices error:", error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });

  app.get("/api/market/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const price = await storage.getLatestPrice(symbol);
      if (!price) {
        return res.status(404).json({ error: "Price not found" });
      }
      res.json(price);
    } catch (error) {
      console.error("Get latest price error:", error);
      res.status(500).json({ error: "Failed to fetch latest price" });
    }
  });

  app.get("/api/market/events", async (req, res) => {
    try {
      const { impact, limit } = req.query;
      const events = await storage.getEconomicEvents(
        impact as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(events);
    } catch (error) {
      console.error("Get economic events error:", error);
      res.status(500).json({ error: "Failed to fetch economic events" });
    }
  });

  app.get("/api/market/cot", async (req, res) => {
    try {
      const { symbol, limit } = req.query;
      const cotData = await storage.getCOTData(
        symbol as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(cotData);
    } catch (error) {
      console.error("Get COT data error:", error);
      res.status(500).json({ error: "Failed to fetch COT data" });
    }
  });

  app.get("/api/market/news", async (req, res) => {
    try {
      const { limit } = req.query;
      const news = await storage.getNews(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(news);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Manual data update endpoints
  app.post("/api/update-data", async (req, res) => {
    try {
      const { type = 'all' } = req.body;
      
      console.log(`🔄 Manual data update triggered: ${type}`);
      await taskScheduler.triggerFetch(type);
      
      res.json({ 
        success: true, 
        message: `Data update completed for: ${type}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Manual data update error:", error);
      res.status(500).json({ error: "Data update failed" });
    }
  });

  app.get("/api/data-status", async (req, res) => {
    try {
      const [dataStatus, schedulerStatus] = await Promise.all([
        marketDataFetcher.getDataStatus(),
        Promise.resolve(taskScheduler.getStatus())
      ]);
      
      res.json({
        data: dataStatus,
        scheduler: schedulerStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Get data status error:", error);
      res.status(500).json({ error: "Failed to get data status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
