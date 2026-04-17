import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import CandidatPage from "./pages/CandidatPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OfflineOverlay from "./components/OfflineOverlay";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/candidat/:id" element={<CandidatPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="bg-bg min-h-screen flex flex-col font-sans text-[#1c1917] selection:bg-primary/10 selection:text-primary">
      <BrowserRouter>
        <OfflineOverlay />
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
