import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AIEngine from "./pages/AIEngine";
import Governance from "./pages/Governance";
import Communication from "./pages/Communication";
import Analytics from "./pages/Analytics";
import Protocol from "./pages/Protocol";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/ai-engine" element={<AIEngine />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/protocol" element={<Protocol />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
