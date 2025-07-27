import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { VitaLogo } from '@/components/VitaLogo';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Demo credentials helper
  const fillDemoCredentials = (userType: 'admin' | 'trader') => {
    const demoUsers = {
      admin: { email: 'francesco.casella@vita.com', password: 'vita123' },
      trader: { email: 'marco.nava@vita.com', password: 'vita123' }
    };
    
    setFormData(demoUsers[userType]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <VitaLogo size="lg" showText={true} />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access the VITA trading platform
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="vita-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-vita-gradient hover:shadow-vita-glow transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="vita-card p-4">
          <div className="text-center space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Demo Credentials</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1"
              >
                Admin (Francesco)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fillDemoCredentials('trader')}
                className="flex-1"
              >
                Trader (Marco)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              All users use password: <code className="bg-muted px-1 rounded">vita123</code>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          VITA Platform v2.4.1 • Internal Use Only
        </div>
      </div>
    </div>
  );
};

export default Login;