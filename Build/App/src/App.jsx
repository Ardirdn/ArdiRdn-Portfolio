import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import React, { useState } from "react";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portfolio from "./Pages/Portfolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import ToolsDetails from "./components/ToolsDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from "framer-motion";
import Service from "./Pages/Service";
import LevelDesign from "./Pages/LevelDesign";
import LevelDesignDetail from "./Pages/LevelDesignDetail";
import CategoryPage from "./Pages/ThreeD/CategoryPage";
import PackPage from "./Pages/ThreeD/PackPage";

import ItemPage from "./Pages/ThreeD/ItemPage";
import UiUxPage from "./Pages/UiUxPage";
import UiUxDetail from "./Pages/UiUxDetail";
import ModularCharacterDetail from "./Pages/ModularCharacterDetail";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portfolio />
          <Service />
          <ContactPage />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                This website was built using{" "}
                <a
                  className="opacity-30 duration-300 transition-all hover:opacity-50"
                  href="https://github.com/EkiZR/Portofolio_V5/"
                >
                  EkiZR's
                </a>{" "}
                website template.
              </span>
            </center>
          </footer>
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          This website was built using{" "}
          <a
            className="opacity-30 duration-300 transition-all hover:opacity-50"
            href="https://github.com/EkiZR/Portofolio_V5/"
          >
            EkiZR's
          </a>{" "}
          website template.
        </span>
      </center>
    </footer>
  </>
);

const ToolPageLayout = () => (
  <>
    <ToolsDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          This website was built using{" "}
          <a
            className="opacity-30 duration-300 transition-all hover:opacity-50"
            href="https://github.com/EkiZR/Portofolio_V5/"
          >
            EkiZR's
          </a>{" "}
          website template.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              showWelcome={showWelcome}
              setShowWelcome={setShowWelcome}
            />
          }
        />
        <Route path="/games/:id" element={<ProjectPageLayout />} />
        <Route path="/tools/:id" element={<ToolPageLayout />} />
        <Route path="/modular-character" element={<ModularCharacterDetail />} />
        <Route path="/level-designs" element={<LevelDesign />} />
        <Route path="/level-designs/:id" element={<LevelDesignDetail />} />
        <Route path="/3d-assets/:categoryId" element={<CategoryPage />} />
        <Route path="/3d-assets/:categoryId/:packId" element={<PackPage />} />
        <Route path="/3d-assets/:categoryId/:packId/:itemId" element={<ItemPage />} />
        <Route path="/ui-ux" element={<UiUxPage />} />
        <Route path="/ui-ux/:id" element={<UiUxDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
