import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import VinylCollection from "./pages/VinylCollection";
import Auth from "./pages/Auth";

// Create a PrivateRoute component to protect the VinylCollection route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-[#f8f9fa]">
            <Header />
            <Routes>
              <Route path="/" element={<Auth />} />
              {/* Protect the /collection route with PrivateRoute */}
              <Route
                path="/collection"
                element={
                  <PrivateRoute>
                    <VinylCollection />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
