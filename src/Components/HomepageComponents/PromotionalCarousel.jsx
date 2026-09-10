import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "/projects/HeroSection/PITAPATA - ADVERTISING.png",
  "/projects/HeroSection/Poster 1.png",
  "/projects/HeroSection/Poster 2.png",
];

export const PromotionalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="hero-banner-container">
      <div className="hero-banner-image-wrapper">
        {HERO_IMAGES.map((imagePath, index) => (
          <img
            key={imagePath}
            src={imagePath}
            alt="MOOSTYLES Banner"
            className={`hero-banner-image ${
              index === activeIndex ? "hero-banner-image-active" : "hero-banner-image-inactive"
            }`}
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TW9vU3R5bGUgQmFubmVyPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
        ))}
      </div>
    </div>
  );
};
