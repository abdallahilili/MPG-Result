import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import CandidatPage from "./pages/CandidatPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <div className="bg-bg min-h-screen flex flex-col font-sans text-[#1c1917] selection:bg-primary/10 selection:text-primary" dir={i18n.dir()}>
      <BrowserRouter>
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
