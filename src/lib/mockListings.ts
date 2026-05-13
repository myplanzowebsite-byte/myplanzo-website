// Mock listings used to preview category browsing and the vendor detail page
// before any real vendor data exists. IDs are prefixed `mock-` so other code
// can detect them and skip DB lookups.

export const VENDOR_CATEGORIES = [
  { emoji: "🎀", label: "Decorators" },
  { emoji: "📸", label: "Photographers" },
  { emoji: "🍽️", label: "Caterers" },
  { emoji: "🏛️", label: "Venues" },
  { emoji: "🎵", label: "DJ & Music" },
  { emoji: "🎂", label: "Cake" },
] as const;

export const EVENT_TAGS = [
  "Birthday",
  "Baby Shower",
  "Anniversary",
  "Farewell",
  "Corporate",
  "Kitty Party",
] as const;

export type MockReview = {
  rating: number;
  title: string;
  comment: string;
  author: string;
};

export type MockListing = {
  id: string;
  title: string;
  vendorName: string;
  category: string; // one of VENDOR_CATEGORIES labels
  eventTags: string[];
  location: string;
  priceMin: number;
  priceMax?: number;
  photos: string[];
  rating: number;
  reviewCount: number;
  reviews: MockReview[];
  description: string;
  eventsCompleted: number;
  waPhone?: string;
};

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: "mock-bloom-decor",
    title: "Pastel Theme Birthday Setup",
    vendorName: "Bloom Decor Co.",
    category: "Decorators",
    eventTags: ["Birthday", "Baby Shower", "Anniversary"],
    location: "Andheri West",
    priceMin: 8000,
    priceMax: 25000,
    photos: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 142,
    reviews: [
      { rating: 5, title: "Beyond expectations", comment: "Did my daughter's 5th birthday — pastel balloon arch, custom backdrop, the whole works. Setup was on time and they cleaned up after.", author: "Priya R." },
      { rating: 5, title: "Worth every rupee", comment: "Booked them for an anniversary surprise. The team understood the brief in one call.", author: "Mehul S." },
      { rating: 4, title: "Lovely team", comment: "Small mix-up with colour palette but they fixed it before guests arrived.", author: "Ruchika D." },
    ],
    description:
      "Themed event decor for birthdays, baby showers and anniversaries. Custom backdrops, balloon installations, table styling and floral. Travel covered across Mumbai. Setup typically 3–4 hours before event start.",
    eventsCompleted: 142,
    waPhone: "919999900001",
  },
  {
    id: "mock-luxe-decor",
    title: "Premium Anniversary & Corporate Decor",
    vendorName: "Luxe Studio",
    category: "Decorators",
    eventTags: ["Anniversary", "Corporate"],
    location: "Bandra West",
    priceMin: 15000,
    priceMax: 75000,
    photos: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 88,
    reviews: [
      { rating: 5, title: "Truly premium", comment: "Used them for our 10th anniversary at a private hall. Florals were museum-quality.", author: "Sanjana & Mehul" },
      { rating: 5, title: "Best in BKC", comment: "Did our annual townhall — minimal corporate aesthetic, on brief.", author: "Vikram J." },
    ],
    description:
      "High-end decor for milestone anniversaries, brand launches and corporate gatherings. Curated florals, monochrome installations, hand-lettered signage.",
    eventsCompleted: 88,
    waPhone: "919999900002",
  },
  {
    id: "mock-tiny-feet-decor",
    title: "Baby Shower Specials — Soft Pastels",
    vendorName: "Tiny Feet Events",
    category: "Decorators",
    eventTags: ["Baby Shower", "Birthday"],
    location: "Powai",
    priceMin: 6000,
    priceMax: 18000,
    photos: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 110,
    reviews: [
      { rating: 5, title: "Magical", comment: "My baby shower setup looked like a fairy tale. Everyone asked who did it.", author: "Neha K." },
      { rating: 5, title: "Sweet team", comment: "Loved working with them — patient with all my Pinterest references.", author: "Aanchal M." },
    ],
    description:
      "Specialists in baby showers and gender reveals. Pastel and earthy palettes, hand-tied florals, custom name signage. Includes 2 hours of setup + dismantle.",
    eventsCompleted: 110,
  },
  {
    id: "mock-lens-light",
    title: "Candid Event Photography (8 hrs)",
    vendorName: "Lens & Light Studio",
    category: "Photographers",
    eventTags: ["Birthday", "Anniversary", "Corporate"],
    location: "Bandra East",
    priceMin: 6500,
    priceMax: 25000,
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 98,
    reviews: [
      { rating: 5, title: "Captured every moment", comment: "Got my parents' anniversary on camera. Edited photos delivered in 4 days.", author: "Ananya G." },
      { rating: 4, title: "Solid pro", comment: "Two-photographer team for a corporate party. Quiet, professional, great output.", author: "Vikram J." },
    ],
    description:
      "Eight hours of candid + posed event coverage by a two-person team. Includes a 100-photo edited gallery delivered within 7 days. Add-ons available for video and same-day reels.",
    eventsCompleted: 98,
    waPhone: "919999900004",
  },
  {
    id: "mock-frame-stories",
    title: "Cinematic Event Films",
    vendorName: "Frame Stories",
    category: "Photographers",
    eventTags: ["Anniversary", "Corporate", "Birthday"],
    location: "Juhu",
    priceMin: 9500,
    priceMax: 45000,
    photos: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 64,
    reviews: [
      { rating: 5, title: "Stunning film", comment: "Our anniversary highlight reel made my mom cry. Worth the price.", author: "Riya & Tej" },
      { rating: 4, title: "Great quality", comment: "Slight delay in delivery but the final edit was beautiful.", author: "Aakash P." },
    ],
    description:
      "Cinematic photo + video coverage for milestone events. 90-second highlight reel + full-length film + 150-photo edited gallery. Drone available on request.",
    eventsCompleted: 64,
    waPhone: "919999900005",
  },
  {
    id: "mock-flavours-bombay",
    title: "Multi-Cuisine Buffet (₹350/plate)",
    vendorName: "Flavours of Bombay",
    category: "Caterers",
    eventTags: ["Birthday", "Baby Shower", "Corporate", "Kitty Party"],
    location: "Powai",
    priceMin: 350,
    priceMax: 800,
    photos: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 215,
    reviews: [
      { rating: 5, title: "Crowd loved it", comment: "Fed 80 guests at our baby shower. Food was hot, plenty of veg + non-veg options.", author: "Neha K." },
      { rating: 5, title: "Best catering in Powai", comment: "Booked twice already. Live counters are a hit.", author: "Smita R." },
    ],
    description:
      "North Indian, Continental, Chinese and Indo-Chinese buffets. Minimum 30 pax. Includes live chaat and dessert counters at higher tiers. Vegetarian and Jain options always available.",
    eventsCompleted: 215,
    waPhone: "919999900006",
  },
  {
    id: "mock-spice-route",
    title: "Premium Corporate Catering",
    vendorName: "Spice Route Catering",
    category: "Caterers",
    eventTags: ["Corporate", "Anniversary"],
    location: "Andheri East",
    priceMin: 450,
    priceMax: 1200,
    photos: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 76,
    reviews: [
      { rating: 5, title: "Professional team", comment: "Did our 200-pax annual day. Service was crisp, food labels were clear.", author: "Tanvi M." },
      { rating: 4, title: "Loved the desserts", comment: "Mains were standard but the dessert spread stole the show.", author: "Rohit A." },
    ],
    description:
      "Corporate-grade catering with uniformed servers, allergen labelling and Jain/Vegan/Halal certification on request. Minimum 50 pax.",
    eventsCompleted: 76,
    waPhone: "919999900007",
  },
  {
    id: "mock-signature-garden",
    title: "Garden Banquet (200 pax) — Full Day",
    vendorName: "Signature Garden Hall",
    category: "Venues",
    eventTags: ["Birthday", "Anniversary", "Baby Shower"],
    location: "Goregaon West",
    priceMin: 18000,
    priceMax: 45000,
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    ],
    rating: 4.6,
    reviewCount: 54,
    reviews: [
      { rating: 5, title: "Perfect outdoor space", comment: "Hosted my dad's 60th — the garden setup was lovely at golden hour.", author: "Sneha B." },
      { rating: 4, title: "Good value", comment: "Decent venue for the price. Parking was the only constraint.", author: "Aarav S." },
    ],
    description:
      "Outdoor garden + covered banquet hall combo. Capacity 200 standing / 140 seated. Full-day rate includes basic stage, AV, parking and one-time housekeeping turnover.",
    eventsCompleted: 54,
    waPhone: "919999900008",
  },
  {
    id: "mock-skyline-banquet",
    title: "Rooftop Banquet — BKC",
    vendorName: "Skyline Banquets",
    category: "Venues",
    eventTags: ["Corporate", "Anniversary"],
    location: "BKC",
    priceMin: 35000,
    priceMax: 90000,
    photos: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    ],
    rating: 4.5,
    reviewCount: 41,
    reviews: [
      { rating: 5, title: "Stunning skyline view", comment: "Closed an anniversary dinner with 40 close family. The view at sunset was unreal.", author: "Priya & Karan" },
      { rating: 4, title: "Premium space", comment: "Pricey but justifiable for the address.", author: "Aditya N." },
    ],
    description:
      "Rooftop banquet with skyline view, capacity 120 seated. Includes in-house bar, AV and one event manager. Sound restrictions apply after 11pm.",
    eventsCompleted: 41,
  },
  {
    id: "mock-rhythm-house",
    title: "DJ + Live Sax Combo",
    vendorName: "Rhythm House Events",
    category: "DJ & Music",
    eventTags: ["Birthday", "Anniversary", "Corporate"],
    location: "Juhu",
    priceMin: 12000,
    priceMax: 35000,
    photos: [
      "https://images.unsplash.com/photo-1571935441005-ec0c432da1fa?w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 76,
    reviews: [
      { rating: 5, title: "Read the room perfectly", comment: "DJ shifted from lounge to dance floor exactly when we needed it.", author: "Karan V." },
      { rating: 4, title: "Sax was the highlight", comment: "Loved the live sax during cocktails. Worth the upgrade.", author: "Anjali K." },
    ],
    description:
      "Resident DJ with optional live saxophone or percussionist. 4-hour set with custom playlist consultation. Sound + lighting included up to 100 pax.",
    eventsCompleted: 76,
    waPhone: "919999900010",
  },
  {
    id: "mock-sweet-affair",
    title: "Custom Theme Cakes (from ₹2,500)",
    vendorName: "The Sweet Affair",
    category: "Cake",
    eventTags: ["Birthday", "Anniversary", "Baby Shower"],
    location: "Malad West",
    priceMin: 2500,
    priceMax: 12000,
    photos: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 189,
    reviews: [
      { rating: 5, title: "Tastes as good as it looks", comment: "Got a 3-tier unicorn cake for my daughter — moist, not over-sweet.", author: "Tanvi M." },
      { rating: 5, title: "FSSAI certified, prompt", comment: "Delivered on time across city. Highly recommend.", author: "Sneha B." },
    ],
    description:
      "Custom theme cakes — fondant, buttercream or photo-print. Eggless on request at no extra cost. 48-hour notice for orders above 2 kg.",
    eventsCompleted: 189,
    waPhone: "919999900011",
  },
  {
    id: "mock-farewell-fix",
    title: "Office Farewell & Send-off Decor",
    vendorName: "Farewell Fix",
    category: "Decorators",
    eventTags: ["Farewell", "Corporate"],
    location: "Lower Parel",
    priceMin: 10000,
    priceMax: 30000,
    photos: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 52,
    reviews: [
      { rating: 5, title: "Made the day memorable", comment: "Organised our manager's farewell in 48 hours. Photo wall was a hit.", author: "Arjun S." },
      { rating: 4, title: "Quick turnaround", comment: "Good last-minute option for office events.", author: "Riya K." },
    ],
    description:
      "Specialist for office farewells, retirements and send-offs. Themed backdrops, memory walls, custom signage. Setup possible same-day on weekdays.",
    eventsCompleted: 52,
  },
];

// Map free-text input from the hero search to either a vendor category or an
// event tag. Returns whichever it matched (and the canonical label).
const CATEGORY_ALIASES: Record<string, string> = {
  decorator: "Decorators",
  decorators: "Decorators",
  decoration: "Decorators",
  decor: "Decorators",
  photographer: "Photographers",
  photographers: "Photographers",
  photography: "Photographers",
  photo: "Photographers",
  caterer: "Caterers",
  caterers: "Caterers",
  catering: "Caterers",
  food: "Caterers",
  venue: "Venues",
  venues: "Venues",
  hall: "Venues",
  banquet: "Venues",
  dj: "DJ & Music",
  music: "DJ & Music",
  band: "DJ & Music",
  cake: "Cake",
  bakery: "Cake",
};

const EVENT_ALIASES: Record<string, string> = {
  birthday: "Birthday",
  "birthday party": "Birthday",
  bday: "Birthday",
  "baby shower": "Baby Shower",
  godhbharai: "Baby Shower",
  anniversary: "Anniversary",
  farewell: "Farewell",
  "send off": "Farewell",
  corporate: "Corporate",
  "office party": "Corporate",
  "kitty party": "Kitty Party",
  kitty: "Kitty Party",
};

export type NormalizedSearch = {
  category?: string;
  event?: string;
  q?: string;
};

/** Map a free-text event input to a category or event tag (or fall through as `q`). */
export function normalizeSearchInput(input: string): NormalizedSearch {
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return {};

  if (CATEGORY_ALIASES[cleaned]) return { category: CATEGORY_ALIASES[cleaned] };
  if (EVENT_ALIASES[cleaned]) return { event: EVENT_ALIASES[cleaned] };

  for (const [alias, canonical] of Object.entries(CATEGORY_ALIASES)) {
    if (cleaned.includes(alias)) return { category: canonical };
  }
  for (const [alias, canonical] of Object.entries(EVENT_ALIASES)) {
    if (cleaned.includes(alias)) return { event: canonical };
  }
  return { q: input.trim() };
}

/** Filter mock listings against browse-page search params. */
export function filterMockListings(opts: {
  category?: string;
  event?: string;
  zone?: string;
  q?: string;
}): MockListing[] {
  const { category, event, zone, q } = opts;
  const cat = category?.toLowerCase();
  const evt = event?.toLowerCase();
  const z = zone?.toLowerCase();
  const query = q?.toLowerCase();
  return MOCK_LISTINGS.filter((m) => {
    if (cat && m.category.toLowerCase() !== cat) return false;
    if (evt && !m.eventTags.some((t) => t.toLowerCase() === evt)) return false;
    if (z && !m.location.toLowerCase().includes(z)) return false;
    if (query) {
      const hay = `${m.title} ${m.vendorName} ${m.description} ${m.eventTags.join(" ")} ${m.category}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function getMockListing(id: string): MockListing | undefined {
  return MOCK_LISTINGS.find((m) => m.id === id);
}

export function isMockId(id: string): boolean {
  return id.startsWith("mock-");
}
