import { LanguageProvider, EffectsProvider } from '@/core/contexts';
import { useEffectStyles } from '@/core/hooks';
import { Toast, TooltipProvider, SonnerToaster } from '@/ui';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatTalkingHead } from '@/features/chat/ui';
import { TalkingHead, FacialRigEditor } from '@/features/avatar/ui';
import { SpecialEffects } from '@/features/effects/ui';
import ApiKey from '@/features/settings/ui/settings/ApiKey';
import { ProjectInfo } from '@/features/project/ui';
import Hotkeys from '@/features/hotkeys/ui/hotkeys/Hotkeys';
import Games from '@/features/games/ui/games/Games';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

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
          <SonnerToaster />
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </AppContent>
      </EffectsProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
