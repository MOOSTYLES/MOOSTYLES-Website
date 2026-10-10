import { RotateCw, Package } from "lucide-react";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";

export const Offline = () => {
  return (
    <div className="min-h-screen">
      <Metadata />
      <WebsiteBackground />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
              <Package size={48} className="text-teal-600" />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Page Offline
            </h1>
            <p className="text-gray-600 mb-6">
              The Page is Offline for now, check back later.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RotateCw size={20} />
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
