import { pgTable, text, serial, integer, boolean, timestamp, numeric, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication and profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'admin' | 'trader'
  votes: integer("votes").notNull().default(1),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients/Accounts for portfolio management
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  initialDeposit: numeric("initial_deposit", { precision: 15, scale: 2 }).notNull(),
  currentBalance: numeric("current_balance", { precision: 15, scale: 2 }).notNull(),
  profitSharingPercent: numeric("profit_sharing_percent", { precision: 5, scale: 2 }).notNull().default('20.00'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trades table for individual positions
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'buy' | 'sell'
  entryPrice: numeric("entry_price", { precision: 15, scale: 5 }).notNull(),
  currentPrice: numeric("current_price", { precision: 15, scale: 5 }),
  quantity: numeric("quantity", { precision: 15, scale: 2 }).notNull(),
  pnl: numeric("pnl", { precision: 15, scale: 2 }),
  pnlPercentage: numeric("pnl_percentage", { precision: 8, scale: 4 }),
  status: text("status").notNull().default('open'), // 'open' | 'closed'
  stopLoss: numeric("stop_loss", { precision: 15, scale: 5 }),
  takeProfit1: numeric("take_profit_1", { precision: 15, scale: 5 }),
  takeProfit2: numeric("take_profit_2", { precision: 15, scale: 5 }),
  takeProfit3: numeric("take_profit_3", { precision: 15, scale: 5 }),
  clientId: integer("client_id").references(() => clients.id),
  userId: integer("user_id").references(() => users.id),
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Proposals for governance system
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  symbol: text("symbol").notNull(),
  action: text("action").notNull(), // 'buy' | 'sell'
  targetPrice: numeric("target_price", { precision: 15, scale: 5 }).notNull(),
  stopLoss: numeric("stop_loss", { precision: 15, scale: 5 }),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull(),
  riskScore: numeric("risk_score", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull().default('pending'), // 'pending' | 'approved' | 'rejected' | 'executed'
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  analysis: jsonb("analysis"), // Store technical analysis data
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Votes on proposals
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => proposals.id),
  userId: integer("user_id").references(() => users.id),
  decision: text("decision").notNull(), // 'for' | 'against'
  weight: integer("weight").notNull().default(1),
  rationale: text("rationale"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages for communication
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  channel: text("channel").notNull(),
  type: text("type").notNull().default('text'), // 'text' | 'proposal'
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts for notifications
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'trade' | 'market' | 'system' | 'governance'
  severity: text("severity").notNull().default('info'), // 'info' | 'warning' | 'error' | 'success'
  isRead: boolean("is_read").notNull().default(false),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  trades: many(trades),
  proposals: many(proposals),
  votes: many(votes),
  chatMessages: many(chatMessages),
  alerts: many(alerts),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  trades: many(trades),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
  client: one(clients, {
    fields: [trades.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  creator: one(users, {
    fields: [proposals.createdBy],
    references: [users.id],
  }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  proposal: one(proposals, {
    fields: [votes.proposalId],
    references: [proposals.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  votesFor: true,
  votesAgainst: true,
  status: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Market data tables
export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(), // '15m', '1h', '4h', '1d'
  open: numeric("open", { precision: 15, scale: 5 }).notNull(),
  high: numeric("high", { precision: 15, scale: 5 }).notNull(),
  low: numeric("low", { precision: 15, scale: 5 }).notNull(),
  close: numeric("close", { precision: 15, scale: 5 }).notNull(),
  volume: numeric("volume", { precision: 20, scale: 2 }),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const economicEvents = pgTable("economic_events", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  title: text("title").notNull(),
  impact: text("impact").notNull(), // 'low', 'medium', 'high'
  actual: text("actual"),
  forecast: text("forecast"),
  previous: text("previous"),
  eventTime: timestamp("event_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cotData = pgTable("cot_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  traderType: text("trader_type").notNull(), // 'commercial', 'non_commercial', 'retail'
  longPositions: numeric("long_positions", { precision: 15, scale: 2 }).notNull(),
  shortPositions: numeric("short_positions", { precision: 15, scale: 2 }).notNull(),
  netPositions: numeric("net_positions", { precision: 15, scale: 2 }).notNull(),
  reportDate: timestamp("report_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  summary: text("summary"),
  source: text("source").notNull(),
  link: text("link").notNull().unique(),
  publishedAt: timestamp("published_at").notNull(),
  sentiment: text("sentiment"), // 'positive', 'negative', 'neutral'
  impact: text("impact"), // 'high', 'medium', 'low'
  createdAt: timestamp("created_at").defaultNow(),
});

// Market data insert schemas
export const insertPriceSchema = createInsertSchema(prices).omit({
  id: true,
  createdAt: true,
});

export const insertEconomicEventSchema = createInsertSchema(economicEvents).omit({
  id: true,
  createdAt: true,
});

export const insertCotDataSchema = createInsertSchema(cotData).omit({
  id: true,
  createdAt: true,
});

export const insertNewsItemSchema = createInsertSchema(newsItems).omit({
  id: true,
  createdAt: true,
});

// Market data types
export type InsertPrice = z.infer<typeof insertPriceSchema>;
export type Price = typeof prices.$inferSelect;
export type InsertEconomicEvent = z.infer<typeof insertEconomicEventSchema>;
export type EconomicEvent = typeof economicEvents.$inferSelect;
export type InsertCotData = z.infer<typeof insertCotDataSchema>;
export type CotData = typeof cotData.$inferSelect;
export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;
export type NewsItem = typeof newsItems.$inferSelect;
