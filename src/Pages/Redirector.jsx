import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { isAllowedRedirectTarget, logRedirect } from "@/lib/redirect";

export const Redirector = () => {
  const [searchParams] = useSearchParams();
  const target = searchParams.get("to");
  const isValid = isAllowedRedirectTarget(target);

  useEffect(() => {
    if (isValid) {
      logRedirect(target);
      window.location.replace(target);
    }
  }, [isValid, target]);

  if (!isValid) {
    return (
      <div className="min-h-screen">
        <Metadata
          pageTitle="Invalid Redirect Target | MOOSTYLES"
          pageDescription="This link does not point to an approved destination. Return to MOOSTYLES to browse inZOI content and creator links."
          noindex
        />
        <WebsiteBackground />
        <NavigationBar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="mod-detail__title newdesign-heading">Invalid Redirect Target</h1>
          <p className="mod-detail__empty-state">
            This link does not point to an approved destination and was not followed.
          </p>
          <Link to="/" className="mod-breadcrumb">
            Return home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Metadata
        pageTitle="Redirecting | MOOSTYLES"
        pageDescription="Opening an external destination linked by MOOSTYLES."
        noindex
      />
      <WebsiteBackground />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="mod-detail__description">Redirecting to {target}...</p>
      </main>
    </div>
  );
};
