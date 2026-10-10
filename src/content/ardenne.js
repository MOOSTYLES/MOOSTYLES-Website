export const ARDENNE_LOGOS = {
  black: "/projects/ARDENNE/Logo/ARDENNE LOGO - Black.png",
  white: "/projects/ARDENNE/Logo/ARDENNE LOGO - White.png",
};

export const ARDENNE_CATEGORIES = [
  {
    id: "automobiles",
    enabled: true,
    label: "Automobiles",
    number: "01",
    world: "Land",
    carouselLabel: "Automobile",
    tags: ["automobiles", "automobile", "cars", "car", "automotive"],
    image: "/projects/ARDENNE/automobile.webp",
    alt: "Silver grand touring coupe outside a modern coastal residence",
    caption: "The art of arrival",
    eyebrow: "Precision in motion",
    title: "The road, reimagined.",
    ending: "By design.",
    principle: "Engineering. Elevated.",
    experience: "A beautifully engineered drive.",
    description: "Sculpted silhouettes. Considered details. A new expression of the open road for your inZOI world.",
  },
  {
    id: "yachts",
    enabled: true,
    label: "Yachts",
    number: "02",
    world: "Sea",
    carouselLabel: "Yacht",
    tags: ["yachts", "yacht", "boats", "boat", "yachting"],
    image: "/projects/ARDENNE/yacht.webp",
    alt: "White superyacht on turquoise water beside a rugged coastline",
    caption: "Beyond the horizon",
    eyebrow: "Beyond the horizon",
    title: "Your own latitude.",
    ending: "By nature.",
    principle: "Freedom. Unbounded.",
    experience: "An uncharted stretch of coastline.",
    description: "Quiet coves and open horizons. Discover yachts made for a life that follows its own course.",
  },
  {
    id: "private-aviation",
    // Switch to true when aviation is ready. Its content, tags and assets stay intact.
    enabled: false,
    label: "Private Aviation",
    number: "03",
    world: "Sky",
    carouselLabel: "Aviation",
    tags: ["private aviation", "aviation", "aircraft", "private jets", "private jet", "jets", "jet", "planes", "plane", "airplanes", "airplane"],
    image: "/projects/ARDENNE/aviation.webp",
    alt: "Private business jet on an airfield at dusk",
    caption: "A world within reach",
    eyebrow: "Time is the ultimate luxury",
    title: "A world within reach.",
    ending: "By choice.",
    principle: "Perspective. Redefined.",
    experience: "The quiet above the clouds.",
    description: "Thoughtful cabins and distinctive aircraft. Bring a different perspective to every journey.",
  },
];

export const LIVE_ARDENNE_CATEGORIES = ARDENNE_CATEGORIES.filter((category) => category.enabled);

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

// Public copy follows the enabled categories, including when aviation returns.
export const ARDENNE_PUBLIC_COPY = {
  worlds: `${LIVE_ARDENNE_CATEGORIES.map((category) => category.world).join(". ")}.`,
  worldDescription: list.format(LIVE_ARDENNE_CATEGORIES.map((category) => category.world.toLowerCase())),
  worldSeparator: LIVE_ARDENNE_CATEGORIES.map((category) => category.world).join(" · "),
  categories: list.format(LIVE_ARDENNE_CATEGORIES.map((category) => category.label.toLowerCase())),
  categoryLabels: LIVE_ARDENNE_CATEGORIES.map((category) => category.label).join(" · "),
  collectionHeading: `${LIVE_ARDENNE_CATEGORIES.length === 2 ? "Two" : "Three"} worlds.`,
  experiences: LIVE_ARDENNE_CATEGORIES.map((category) => category.experience).join(" "),
};
