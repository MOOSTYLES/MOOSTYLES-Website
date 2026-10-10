import { getAllProducts } from './shoppingData.js';
import { LIVE_ARDENNE_CATEGORIES, ARDENNE_PUBLIC_COPY } from '../content/ardenne.js';

const getAllProductsForSearch = () => {
  const products = getAllProducts();
  return products.map(product => ({
    id: product.id,
    title: product.name,
    description: product.description,
    content: product.detailedDescription || product.description,
    excerpt: product.description,
    category: product.category || 'products',
    subcategory: product.subcategory || 'general',
    tags: product.tags || [],
    author: product.author || product.brand,
    brand: product.brand,
    price: product.price,
    rating: product.rating,
    image: product.image,
    type: 'product',
    date: product.createdAt,
    url: `/product/${product.id}`,
    inStock: product.inStock,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller
  }));
};

const getStaticPages = () => [
  {
    id: 'home',
    title: 'Home',
    description: 'Welcome to MOOSTYLES - Your destination for InZOI mods and digital content',
    content: 'Discover premium InZOI mods and digital resources from talented creators. Browse our curated collection of game mods, custom content, and more.',
    excerpt: 'Welcome to MOOSTYLES - Your destination for InZOI mods and digital content',
    category: 'pages',
    subcategory: 'main',
    tags: ['home', 'main', 'welcome', 'mods', 'inzoi'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'about',
    title: 'About Me',
    description: 'Learn more about MOOSTYLES and our mission',
    content: 'MOOSTYLES is dedicated to bringing you the best in digital resources and content. We create and curate high-quality mods and custom content for InZOI and other games.',
    excerpt: 'Learn more about MOOSTYLES and our mission',
    category: 'pages',
    subcategory: 'about',
    tags: ['about', 'mission', 'story', 'creator'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/about',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'mods',
    title: 'My Mod List',
    description: 'Browse and download InZOI mods',
    content: 'Explore our collection of InZOI mods including custom brands, items, and content. Each mod is carefully crafted to enhance your InZOI experience.',
    excerpt: 'Browse and download InZOI mods',
    category: 'pages',
    subcategory: 'mods',
    tags: ['mods', 'inzoi', 'game', 'custom content', 'downloads'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/mods',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'ardenne',
    title: 'ARDENNE',
    description: `${ARDENNE_PUBLIC_COPY.worlds} An inZOI collection by MOOSTYLES.`,
    content: `Explore the ARDENNE collection of ${ARDENNE_PUBLIC_COPY.categories} mods.`,
    category: 'pages',
    tags: ['ardenne', ...LIVE_ARDENNE_CATEGORIES.map((category) => category.label.toLowerCase()), 'collection'],
    type: 'page',
    url: '/ardenne',
    image: '/projects/ARDENNE/automobile.webp'
  },
  {
    id: 'ardenne-mods',
    title: 'ARDENNE Collection',
    description: 'Browse ARDENNE mods by category.',
    content: `Find ${ARDENNE_PUBLIC_COPY.categories} mods in the ARDENNE listing.`,
    category: 'pages',
    tags: ['ardenne', 'mods', ...LIVE_ARDENNE_CATEGORIES.map((category) => category.label.toLowerCase()), 'downloads'],
    type: 'page',
    url: '/ardenne/mods',
    image: '/projects/ARDENNE/yacht.webp'
  },
  {
    id: 'saved-products',
    title: 'Saved Mods',
    description: 'View your saved mods and favorite content',
    content: 'Access all the mods and content you\'ve saved for later. Keep track of your favorite items and downloads.',
    excerpt: 'View your saved mods and favorite content',
    category: 'pages',
    subcategory: 'saved',
    tags: ['saved', 'favorites', 'bookmarks', 'mods'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/saved-products',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Get help and support for mods and downloads',
    content: 'Need help with a mod or have questions? Our support page provides answers to common questions and ways to get in touch.',
    excerpt: 'Get help and support for mods and downloads',
    category: 'pages',
    subcategory: 'help',
    tags: ['support', 'help', 'contact', 'assistance'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/support',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Read our privacy policy and data protection practices',
    content: 'Learn about how we collect, use, and protect your personal information. Our privacy policy explains our commitment to your data security.',
    excerpt: 'Read our privacy policy and data protection practices',
    category: 'pages',
    subcategory: 'legal',
    tags: ['privacy', 'policy', 'legal', 'data protection'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/privacy-policy',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Read our terms of service and usage guidelines',
    content: 'Understand the terms and conditions for using our website and downloading our content. Our terms of service outline your rights and responsibilities.',
    excerpt: 'Read our terms of service and usage guidelines',
    category: 'pages',
    subcategory: 'legal',
    tags: ['terms', 'service', 'legal', 'guidelines'],
    author: 'MOOSTYLES',
    type: 'page',
    date: new Date().toISOString(),
    url: '/terms-of-service',
    image: '/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png'
  }
];

export const getGlobalSearchData = () => {
  return [
    ...getAllProductsForSearch(),
    ...getStaticPages()
  ];
};
