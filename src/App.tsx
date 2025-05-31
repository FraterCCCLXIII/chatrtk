import { LanguageProvider } from '@/contexts/LanguageContext';
import { EffectsProvider } from '@/contexts/EffectsContext';
import { useEffectStyles } from '@/hooks/useEffectStyles';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component that applies effect styles
const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const effectStyles = useEffectStyles();
  
  return (
    <div className="app" style={effectStyles}>
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <EffectsProvider>
        <AppContent>
          <Toaster />
          <Sonner />
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppContent>
      </EffectsProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
