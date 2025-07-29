import { db } from "./db";
import { users, clients, trades, proposals } from "../shared/schema";
import { eq } from "drizzle-orm";

// Seed function to populate the database with initial data
export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Check if users already exist
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create users with new schema
    const vitaUsers = await db.insert(users).values([
      {
        email: 'francesco.casella@vita.com',
        password: '$2b$10$hashed_password_here', // In production, properly hash passwords
        username: 'francesco-casella',
        firstName: 'Francesco',
        lastName: 'Casella',
        displayName: 'Francesco Casella',
        role: 'lead_trader',
        votes: 2,
        phone: '+1234567890',
        isActive: true
      },
      {
        email: 'marco.nava@vita.com',
        password: '$2b$10$hashed_password_here',
        username: 'marco-paolo-nava',
        firstName: 'Marco Paolo',
        lastName: 'Nava',
        displayName: 'Marco Paolo Nava',
        role: 'senior_trader',
        votes: 1,
        phone: '+1234567891',
        isActive: true
      },
      {
        email: 'andrea.roberto@vita.com',
        password: '$2b$10$hashed_password_here',
        username: 'andrea-roberto',
        firstName: 'Andrea',
        lastName: 'Roberto',
        displayName: 'Andrea Roberto',
        role: 'trader',
        votes: 1,
        phone: '+1234567892',
        isActive: true
      },
      {
        email: 'giorgio.greco@vita.com',
        password: '$2b$10$hashed_password_here',
        username: 'giorgio-greco',
        firstName: 'Giorgio',
        lastName: 'Greco',
        displayName: 'Giorgio Greco',
        role: 'trader',
        votes: 1,
        phone: '+1234567893',
        isActive: true
      }
    ]).returning();

    console.log(`✅ Created ${vitaUsers.length} users`);

    // Create sample clients
    const sampleClients = await db.insert(clients).values([
      {
        accountId: 'CL001',
        name: 'Portfolio Alpha',
        email: 'alpha@client.com',
        initialDeposit: '50000.00',
        currentBalance: '65000.00',
        profitSharingPercent: '20.00'
      },
      {
        accountId: 'CL002',
        name: 'Portfolio Beta',
        email: 'beta@client.com',
        initialDeposit: '100000.00',
        currentBalance: '125000.00',
        profitSharingPercent: '25.00'
      },
      {
        accountId: 'CL003',
        name: 'Portfolio Gamma',
        email: 'gamma@client.com',
        initialDeposit: '75000.00',
        currentBalance: '82000.00',
        profitSharingPercent: '15.00'
      }
    ]).returning();

    console.log(`✅ Created ${sampleClients.length} clients`);

    // Create sample trades
    const sampleTrades = await db.insert(trades).values([
      {
        symbol: 'EUR/USD',
        type: 'buy',
        entryPrice: '1.0850',
        currentPrice: '1.0892',
        quantity: '100000.00',
        pnl: '420.00',
        pnlPercentage: '0.39',
        status: 'open',
        stopLoss: '1.0750',
        takeProfit1: '1.0950',
        takeProfit2: '1.1050',
        takeProfit3: '1.1200',
        clientId: sampleClients[0].id,
        userId: vitaUsers[0].id
      },
      {
        symbol: 'GBP/JPY',
        type: 'sell',
        entryPrice: '185.42',
        currentPrice: '184.88',
        quantity: '50000.00',
        pnl: '270.00',
        pnlPercentage: '0.29',
        status: 'open',
        stopLoss: '186.50',
        takeProfit1: '183.50',
        takeProfit2: '182.00',
        takeProfit3: '180.50',
        clientId: sampleClients[1].id,
        userId: vitaUsers[1].id
      }
    ]).returning();

    console.log(`✅ Created ${sampleTrades.length} trades`);

    // Create sample proposals
    const sampleProposals = await db.insert(proposals).values([
      {
        title: 'EUR/USD Long Position',
        description: 'Technical analysis shows strong support at 1.0850 with bullish momentum',
        symbol: 'EUR/USD',
        action: 'buy',
        targetPrice: '1.0950',
        stopLoss: '1.0750',
        confidence: '85.50',
        riskScore: '3.2',
        analysis: {
          technical: 85,
          fundamental: 70,
          sentiment: 80,
          risk: 32,
          momentum: 75,
          volume: 68
        },
        createdBy: vitaUsers[0].id
      },
      {
        title: 'USD/JPY Short Opportunity',
        description: 'Overbought conditions with potential reversal at resistance level',
        symbol: 'USD/JPY',
        action: 'sell',
        targetPrice: '148.50',
        stopLoss: '151.20',
        confidence: '72.30',
        riskScore: '4.1',
        analysis: {
          technical: 72,
          fundamental: 65,
          sentiment: 70,
          risk: 41,
          momentum: 60,
          volume: 55
        },
        createdBy: vitaUsers[1].id
      }
    ]).returning();

    console.log(`✅ Created ${sampleProposals.length} proposals`);

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDatabase();
  process.exit(0);
}