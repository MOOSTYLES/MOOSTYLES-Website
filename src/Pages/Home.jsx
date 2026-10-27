import { NavigationBar } from "@/Components/NavigationBar";
import { Metadata } from "@/Components/Metadata";
import { FeaturedCollections } from "@/Components/HomepageComponents/FeaturedCollections";
import { Overview, SupportMyWork } from "@/Components/HomepageComponents/SupportMyWork";
import { ModListSection } from "@/Components/HomepageComponents/ModListSection";
import { PartnershipCallout } from "@/Components/HomepageComponents/PartnershipCallout";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";

export const Home = () => (
  <>
    <Metadata />

    <div className="min-h-screen text-gray-900 relative">
      <WebsiteBackground />
      <NavigationBar />
      <main id="main-content">
        <FeaturedCollections />
        <Overview />
        <ModListSection />
        <SupportMyWork />
        <PartnershipCallout />
        <Footer />
      </main>
    </div>
  </>
);
