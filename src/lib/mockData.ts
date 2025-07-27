// Mock data for VITA platform
import { User, Trade, Portfolio, Proposal, Vote, ChatMessage, Alert } from './types';

// Static users as per requirements
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'francesco.casella@vita.com',
    name: 'Francesco Casella',
    role: 'admin',
    votes: 2
  },
  {
    id: '2',
    email: 'marco.nava@vita.com',
    name: 'Marco Paolo Nava',
    role: 'trader',
    votes: 1
  },
  {
    id: '3',
    email: 'andrea.roberto@vita.com',
    name: 'Andrea Roberto',
    role: 'trader',
    votes: 1
  },
  {
    id: '4',
    email: 'giorgio.greco@vita.com',
    name: 'Giorgio Greco',
    role: 'trader',
    votes: 1
  }
];

export const MOCK_TRADES: Trade[] = [
  {
    id: 'T001',
    symbol: 'EUR/USD',
    type: 'buy',
    entry_price: 1.0850,
    current_price: 1.0892,
    quantity: 100000,
    pnl: 420.00,
    pnl_percentage: 0.39,
    status: 'open',
    opened_at: '2024-01-15T09:30:00Z',
    user_id: '1'
  },
  {
    id: 'T002',
    symbol: 'GBP/JPY',
    type: 'sell',
    entry_price: 185.42,
    current_price: 184.88,
    quantity: 50000,
    pnl: 270.00,
    pnl_percentage: 0.29,
    status: 'open',
    opened_at: '2024-01-15T11:15:00Z',
    user_id: '2'
  },
  {
    id: 'T003',
    symbol: 'USD/CHF',
    type: 'buy',
    entry_price: 0.8721,
    current_price: 0.8745,
    quantity: 75000,
    pnl: 180.00,
    pnl_percentage: 0.28,
    status: 'open',
    opened_at: '2024-01-15T14:20:00Z',
    user_id: '3'
  },
  {
    id: 'T004',
    symbol: 'AUD/NZD',
    type: 'sell',
    entry_price: 1.0920,
    current_price: 1.0885,
    quantity: 60000,
    pnl: 210.00,
    pnl_percentage: 0.32,
    status: 'open',
    opened_at: '2024-01-15T16:45:00Z',
    user_id: '4'
  },
  {
    id: 'T005',
    symbol: 'USD/JPY',
    type: 'buy',
    entry_price: 149.85,
    current_price: 150.42,
    quantity: 80000,
    pnl: 456.00,
    pnl_percentage: 0.38,
    status: 'closed',
    opened_at: '2024-01-10T08:00:00Z',
    closed_at: '2024-01-12T16:30:00Z',
    user_id: '1'
  }
];

export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'P001',
    user_id: '1',
    total_value: 247382.50,
    daily_pnl: 3247.80,
    daily_pnl_percentage: 1.33,
    open_positions: 12,
    risk_level: 'medium',
    margin_used: 12340.15,
    free_margin: 235042.35,
    margin_level: 1904.2
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'TRP-001',
    title: 'EUR/USD Long Position - ECB Dovish Outlook',
    description: 'Strong bullish momentum on EUR/USD following ECB monetary policy signals. Technical indicators show oversold conditions with high probability reversal.',
    symbol: 'EUR/USD',
    action: 'buy',
    target_price: 1.0950,
    stop_loss: 1.0800,
    confidence: 87,
    risk_score: 3.2,
    created_by: 'AI Engine',
    created_at: '2024-01-15T10:30:00Z',
    status: 'pending',
    votes_for: 2,
    votes_against: 0,
    analysis: {
      technical: 85,
      fundamental: 78,
      sentiment: 92,
      risk: 68,
      momentum: 88,
      volume: 76
    }
  },
  {
    id: 'TRP-002',
    title: 'GBP/JPY Short - Risk-Off Sentiment',
    description: 'High volatility pair showing signs of exhaustion at resistance levels. COT data indicates retail longs at extreme levels.',
    symbol: 'GBP/JPY',
    action: 'sell',
    target_price: 182.50,
    stop_loss: 186.80,
    confidence: 73,
    risk_score: 4.1,
    created_by: 'AI Engine',
    created_at: '2024-01-15T12:45:00Z',
    status: 'approved',
    votes_for: 3,
    votes_against: 1,
    analysis: {
      technical: 79,
      fundamental: 65,
      sentiment: 82,
      risk: 59,
      momentum: 71,
      volume: 68
    }
  }
];

export const MOCK_VOTES: Vote[] = [
  {
    id: 'V001',
    proposal_id: 'TRP-001',
    user_id: '1',
    decision: 'for',
    weight: 2,
    rationale: 'Strong technical setup aligns with macro outlook',
    created_at: '2024-01-15T10:35:00Z'
  },
  {
    id: 'V002',
    proposal_id: 'TRP-002',
    user_id: '2',
    decision: 'for',
    weight: 1,
    rationale: 'COT data supports the short thesis',
    created_at: '2024-01-15T12:50:00Z'
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'M001',
    content: 'EUR/USD showing strong momentum. AI engine confirms bullish sentiment.',
    user_id: '1',
    user_name: 'Francesco Casella',
    channel: 'general',
    created_at: '2024-01-15T10:30:00Z',
    type: 'text'
  },
  {
    id: 'M002',
    content: 'Agreed. COT data also supports long position.',
    user_id: '2',
    user_name: 'Marco Paolo Nava',
    channel: 'general',
    created_at: '2024-01-15T10:32:00Z',
    type: 'text'
  },
  {
    id: 'M003',
    content: 'Proposal TRP-001 submitted for EUR/USD long. Please review.',
    user_id: '1',
    user_name: 'Francesco Casella',
    channel: 'general',
    created_at: '2024-01-15T10:35:00Z',
    type: 'proposal'
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'A001',
    type: 'macro',
    title: 'ECB Rate Decision',
    message: 'European Central Bank maintains rates at 4.50%. Dovish tone detected in forward guidance.',
    severity: 'high',
    created_at: '2024-01-15T14:00:00Z',
    read: false
  },
  {
    id: 'A002',
    type: 'cot',
    title: 'USD Positioning Alert',
    message: 'Commercial traders increased USD net long positions by 15% this week.',
    severity: 'medium',
    created_at: '2024-01-15T09:00:00Z',
    read: true
  }
];