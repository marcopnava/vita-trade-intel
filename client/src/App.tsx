import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AIEngine from "./pages/AIEngine";
import Governance from "./pages/Governance";
import Communication from "./pages/Communication";
import Analytics from "./pages/Analytics";
import Protocol from "./pages/Protocol";
import MarketData from "./pages/MarketData";  
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading VITA Platform...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/">
            {() => {
              window.location.href = "/dashboard";
              return null;
            }}
          </Route>
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/portfolio">
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          </Route>
          <Route path="/ai-engine">
            <ProtectedRoute>
              <AIEngine />
            </ProtectedRoute>
          </Route>
          <Route path="/governance">
            <ProtectedRoute>
              <Governance />
            </ProtectedRoute>
          </Route>
          <Route path="/communication">
            <ProtectedRoute>
              <Communication />
            </ProtectedRoute>
          </Route>
          <Route path="/analytics">
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          </Route>
          <Route path="/protocol">
            <ProtectedRoute>
              <Protocol />
            </ProtectedRoute>
          </Route>
          <Route path="/market-data">
            <ProtectedRoute>
              <MarketData />
            </ProtectedRoute>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;