// VITA Platform Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'trader';
  avatar?: string;
  votes: number; // Francesco = 2, others = 1
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry_price: number;
  current_price: number;
  quantity: number;
  pnl: number;
  pnl_percentage: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  user_id: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  total_value: number;
  daily_pnl: number;
  daily_pnl_percentage: number;
  open_positions: number;
  risk_level: 'low' | 'medium' | 'high';
  margin_used: number;
  free_margin: number;
  margin_level: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  symbol: string;
  action: 'buy' | 'sell';
  target_price: number;
  stop_loss: number;
  confidence: number;
  risk_score: number;
  created_by: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  votes_for: number;
  votes_against: number;
  analysis: {
    technical: number;
    fundamental: number;
    sentiment: number;
    risk: number;
    momentum: number;
    volume: number;
  };
}

export interface Vote {
  id: string;
  proposal_id: string;
  user_id: string;
  decision: 'for' | 'against';
  weight: number;
  rationale?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  channel: string;
  created_at: string;
  type: 'text' | 'system' | 'proposal';
}

export interface Alert {
  id: string;
  type: 'macro' | 'news' | 'cot' | 'technical';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}