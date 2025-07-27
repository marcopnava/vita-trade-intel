// Mock authentication service
import { User, AuthState } from './types';
import { MOCK_USERS } from './mockData';

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user || password !== 'vita123') {
      throw new Error('Invalid credentials');
    }

    const token = this.generateMockToken(user);
    
    this.authState = {
      user,
      token,
      isAuthenticated: true
    };

    // Store in localStorage for persistence
    localStorage.setItem('vita_auth', JSON.stringify(this.authState));

    return { user, token };
  }

  logout(): void {
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false
    };
    localStorage.removeItem('vita_auth');
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getToken(): string | null {
    return this.authState.token;
  }

  // Restore auth state from localStorage
  restoreAuth(): void {
    const stored = localStorage.getItem('vita_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && this.isValidToken(parsed.token)) {
          this.authState = parsed;
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('vita_auth');
      }
    }
  }

  private generateMockToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return `mock_jwt_${btoa(JSON.stringify(payload))}`;
  }

  private isValidToken(token: string): boolean {
    try {
      if (!token.startsWith('mock_jwt_')) return false;
      const payload = JSON.parse(atob(token.replace('mock_jwt_', '')));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();