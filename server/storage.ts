import { 
  users, clients, trades, proposals, votes, chatMessages, alerts,
  prices, economicEvents, cotData, newsItems,
  type User, type InsertUser, type Client, type InsertClient,
  type Trade, type InsertTrade, type Proposal, type InsertProposal,
  type Vote, type InsertVote, type ChatMessage, type InsertChatMessage,
  type Alert, type InsertAlert, type Price, type InsertPrice,
  type EconomicEvent, type InsertEconomicEvent, type CotData, type InsertCotData,
  type NewsItem, type InsertNewsItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Trade operations
  getTrades(): Promise<Trade[]>;
  getTradesByClient(clientId: number): Promise<Trade[]>;
  getTradesByUser(userId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: number, trade: Partial<InsertTrade>): Promise<Trade | undefined>;
  
  // Proposal operations
  getProposals(): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  
  // Vote operations
  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // Chat operations
  getChatMessages(channel: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Alert operations
  getAlertsByUser(userId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<void>;
  
  // Market data operations
  getPrices(symbol?: string, timeframe?: string, limit?: number): Promise<Price[]>;
  getLatestPrice(symbol: string): Promise<Price | undefined>;
  getEconomicEvents(impact?: string, limit?: number): Promise<EconomicEvent[]>;
  getCOTData(symbol?: string, limit?: number): Promise<CotData[]>;
  getNews(limit?: number): Promise<NewsItem[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .update(clients)
      .set({ ...clientData, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return client || undefined;
  }

  // Trade operations
  async getTrades(): Promise<Trade[]> {
    return await db.select().from(trades).orderBy(desc(trades.openedAt));
  }

  async getTradesByClient(clientId: number): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.clientId, clientId));
  }

  async getTradesByUser(userId: number): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.userId, userId));
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values(insertTrade)
      .returning();
    return trade;
  }

  async updateTrade(id: number, tradeData: Partial<InsertTrade>): Promise<Trade | undefined> {
    const [trade] = await db
      .update(trades)
      .set(tradeData)
      .where(eq(trades.id, id))
      .returning();
    return trade || undefined;
  }

  // Proposal operations
  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal || undefined;
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const [proposal] = await db
      .insert(proposals)
      .values(insertProposal)
      .returning();
    return proposal;
  }

  async updateProposal(id: number, proposalData: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const [proposal] = await db
      .update(proposals)
      .set(proposalData)
      .where(eq(proposals.id, id))
      .returning();
    return proposal || undefined;
  }

  // Vote operations
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.proposalId, proposalId));
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db
      .insert(votes)
      .values(insertVote)
      .returning();
    return vote;
  }

  // Chat operations
  async getChatMessages(channel: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.channel, channel))
      .orderBy(desc(chatMessages.createdAt))
      .limit(100);
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertChatMessage)
      .returning();
    return message;
  }

  // Alert operations
  async getAlertsByUser(userId: number): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db
      .update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id));
  }

  // Market data operations
  async getPrices(symbol?: string, timeframe?: string, limit: number = 100): Promise<Price[]> {
    let query = db.select().from(prices);
    
    if (symbol) {
      query = query.where(eq(prices.symbol, symbol));
    }
    if (timeframe) {
      query = query.where(eq(prices.timeframe, timeframe));
    }
    
    return await query
      .orderBy(desc(prices.timestamp))
      .limit(limit);
  }

  async getLatestPrice(symbol: string): Promise<Price | undefined> {
    const [price] = await db
      .select()
      .from(prices)
      .where(eq(prices.symbol, symbol))
      .orderBy(desc(prices.timestamp))
      .limit(1);
    
    return price || undefined;
  }

  async getEconomicEvents(impact?: string, limit: number = 50): Promise<EconomicEvent[]> {
    let query = db.select().from(economicEvents);
    
    if (impact) {
      query = query.where(eq(economicEvents.impact, impact));
    }
    
    return await query
      .orderBy(desc(economicEvents.eventTime))
      .limit(limit);
  }

  async getCOTData(symbol?: string, limit: number = 50): Promise<CotData[]> {
    let query = db.select().from(cotData);
    
    if (symbol) {
      query = query.where(eq(cotData.symbol, symbol));
    }
    
    return await query
      .orderBy(desc(cotData.reportDate))
      .limit(limit);
  }

  async getNews(limit: number = 50): Promise<NewsItem[]> {
    return await db
      .select()
      .from(newsItems)
      .orderBy(desc(newsItems.publishedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
