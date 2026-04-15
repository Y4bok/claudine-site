import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Profils from "./pages/Profils";
import MonProfil from "./pages/MonProfil";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Chat from "./pages/Chat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/profils" component={Profils} />
      <Route path="/mon-profil" component={MonProfil} />
      <Route path="/inscription" component={Inscription} />
      <Route path="/connexion" component={Connexion} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:conversationId" component={Chat} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
