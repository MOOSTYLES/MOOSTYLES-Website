import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { ModDetail } from "./Pages/ModDetail";
import { ModsIndex } from "./Pages/ModsIndex";
import { Ardenne } from "./Pages/Ardenne";
import { ArdenneMods } from "./Pages/ArdenneMods";
import { Gallery } from "./Pages/Gallery";
import { GalleryEntry } from "./Pages/GalleryEntry";
import { ModDownload } from "./Pages/ModDownload";
import { Redirector } from "./Pages/Redirector";
import AboutMe from "./Pages/AboutMe";
import { Support } from "./Pages/Support";
import { SavedProducts } from "./Pages/SavedProducts";
import { PrivacyPolicy } from "./Pages/PrivacyPolicy";
import { TermsOfService } from "./Pages/TermsOfService";
import { NotFound } from "./Pages/NotFound";
import { Offline } from "./Pages/Offline";
import { Links } from "./Pages/Links";
import { GuidesIndex } from "./Pages/Guides/GuidesIndex";
import { InstallingMods } from "./Pages/Guides/InstallingMods";
import { Troubleshooting } from "./Pages/Guides/Troubleshooting";
import { ModSafety } from "./Pages/Guides/ModSafety";
import ErrorBoundary from "./Components/ErrorBoundary";
import { FirstVisitGates } from "./Components/gates/FirstVisitGates";
import { BrandTransition } from "./Components/BrandTransition";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <FirstVisitGates />
        <BrandTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/saved-products" element={<SavedProducts />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/links" element={<Links />} />
          <Route path="/mods" element={<ModsIndex />} />
          <Route path="/ardenne" element={<Ardenne />} />
          <Route path="/ardenne/mods" element={<ArdenneMods />} />
          <Route path="/mods/:slug" element={<ModDetail />} />

          <Route path="/product/:id" element={<ModDetail />} />
          <Route path="/brands" element={<ModsIndex />} />

          <Route path="/collections" element={<Navigate to="/mods" replace />} />
          <Route path="/collections/:slug" element={<Navigate to="/mods" replace />} />
          <Route path="/brand/:id" element={<Navigate to="/mods" replace />} />

          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<GalleryEntry />} />

          <Route path="/api/mods/:id/download" element={<ModDownload />} />
          <Route path="/redirector" element={<Redirector />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/guides" element={<GuidesIndex />} />
          <Route path="/guides/installing-mods" element={<InstallingMods />} />
          <Route path="/guides/troubleshooting" element={<Troubleshooting />} />
          <Route path="/guides/mod-safety" element={<ModSafety />} />
          <Route path="/common-questions" element={<Navigate to="/support" replace />} />
          <Route path="/archive" element={<Navigate to="/mods" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrandTransition>
      </div>
    </ErrorBoundary>
  );
}

export default App;
