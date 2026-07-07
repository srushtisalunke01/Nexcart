export const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "Laptop",
    subcategories: [
      { id: "audio", name: "Premium Audio" },
      { id: "cameras", name: "Cameras & Vlogging" },
      { id: "accessories", name: "Charging & Cables" },
    ],
  },
  {
    id: "wearables",
    name: "Wearables",
    icon: "Watch",
    subcategories: [
      { id: "smartwatches", name: "Smartwatches" },
      { id: "fitness", name: "Fitness Trackers" },
    ],
  },
  {
    id: "luxury",
    name: "Luxury",
    icon: "Sparkles",
    subcategories: [
      { id: "timepieces", name: "Luxury Watches" },
      { id: "accessories-lux", name: "Fine Leather Goods" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Style",
    icon: "Shirt",
    subcategories: [
      { id: "menswear", name: "Men's Apparel" },
      { id: "womenswear", name: "Women's Collection" },
      { id: "shoes", name: "Premium Sneakers" },
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    icon: "Home",
    subcategories: [
      { id: "furniture", name: "Minimalist Furniture" },
      { id: "appliances", name: "Smart Appliances" },
    ],
  },
];

export const BRANDS = [
  {
    name: "Sony",
    logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Bose",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Rolex",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Dyson",
    logo: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Nike",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

// Seed reviews helper
const MOCK_REVIEWS = [
  {
    id: "rev-1",
    userName: "Alexander Wright",
    rating: 5,
    date: "2026-06-15",
    comment:
      "Absolutely outstanding. The build quality is unreal, and the product behaves exactly as advertised. Totally worth the premium cost.",
    verified: true,
    likes: 42,
  },
  {
    id: "rev-2",
    userName: "Sophia Martinez",
    rating: 4,
    date: "2026-06-20",
    comment:
      "Very sleek design. The integrations are flawless. My only complaint is that the charging cable is a bit short. Otherwise, 5 stars!",
    verified: true,
    likes: 18,
  },
  {
    id: "rev-3",
    userName: "Marcus Vance",
    rating: 5,
    date: "2026-06-28",
    comment:
      "This is the second item I've bought from this brand. They never fail to deliver luxury quality. Delivery was super fast too, arrived next day.",
    verified: true,
    likes: 29,
  },
  {
    id: "rev-4",
    userName: "Elena Rostova",
    rating: 3,
    date: "2026-07-01",
    comment:
      "It works well and looks beautiful, but the configuration took a bit longer than I expected. Good product, but slightly overpriced.",
    verified: false,
    likes: 5,
  },
];

// Helper to generate 360 preview image angles from a single stock photo with rotation filter simulations
const gen360Angles = (url) => {
  return [url, url, url, url, url, url, url, url];
};

export const PRODUCTS = [
  // AUDIO
  {
    id: "aud-01",
    name: "AeroPulse ANC Pro",
    tagline: "Sound in its purest form.",
    description:
      "Experience premium active noise cancelling like never before. The AeroPulse ANC Pro headphones feature hybrid adaptive ANC, high-fidelity spatial audio, and an ultra-breathable mesh headband for unmatched comfort during extended listening sessions.",
    price: 399,
    discountPrice: 329,
    discount: 17,
    rating: 4.8,
    reviewsCount: 1420,
    category: "audio",
    parentCategory: "electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Obsidian Black", code: "#1e293b" },
      { name: "Space Grey", code: "#64748b" },
      { name: "Platinum Silver", code: "#cbd5e1" },
    ],
    specifications: {
      "Driver Size": "40mm Dynamic Driver",
      "Frequency Response": "4Hz - 40,000Hz",
      Connectivity: "Bluetooth 5.3 & Ultra-Low Latency Mode",
      "Battery Life": "Up to 40 Hours with ANC On",
      Charging: "USB-C Fast Charge (5 mins = 5 hrs play)",
    },
    features: [
      "Hybrid Adaptive Active Noise Cancelling",
      "High-Res Spatial Audio with Dynamic Head Tracking",
      "Breathable Knit Mesh Headband and Memory Foam Ear Cushions",
      "Dual Mic beamforming with AI-enhanced call clarity",
    ],
    stock: 12,
    freeDelivery: true,
    estimatedDelivery: "Tomorrow, by 10 PM",
    returnPolicy: "30-day Free Returns & Replacements",
    brand: "Sony",
    trending: true,
    dealOfTheDay: true,
  },
  {
    id: "aud-02",
    name: "Synapse Air Earbuds",
    tagline: "Miniature size. Monumental sound.",
    description:
      "The Synapse Air wireless earbuds provide immersive studio-quality sound in a pocket-sized package. Designed with custom-engineered acoustic drivers and active pressure relief, these earbuds deliver comfort that lasts all day.",
    price: 199,
    discountPrice: 159,
    discount: 20,
    rating: 4.6,
    reviewsCount: 840,
    category: "audio",
    parentCategory: "electronics",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Pure White", code: "#f8fafc" },
      { name: "Midnight Teal", code: "#0f766e" },
    ],
    specifications: {
      "Battery Life": "8 Hours (28 Hours with Charging Case)",
      "Water Resistance": "IPX4 Sweat & Splash Resistant",
      "Active Noise Cancellation": "Yes, Active Smart ANC",
      Charging: "Qi-certified Wireless Charging & USB-C",
    },
    features: [
      "Smart Ambient Sound Mode for safety",
      "Ergonomic fit with three sizes of silicone ear tips",
      "Customizable Touch Controls through the NexApp",
    ],
    stock: 50,
    freeDelivery: true,
    estimatedDelivery: "Monday, July 6",
    returnPolicy: "15-day Free Exchange",
    brand: "Bose",
    newArrival: true,
  },

  // WEARABLES
  {
    id: "wear-01",
    name: "Chronos Horizon S3",
    tagline: "Your life, synchronized.",
    description:
      "Meet the future of luxury smartwatches. The Chronos Horizon S3 combines high-grade titanium construction, a gorgeous curved AMOLED micro-display, and comprehensive health diagnostics including ECG, heart-rate variability, and SpO2 tracking.",
    price: 450,
    discountPrice: 389,
    discount: 13,
    rating: 4.9,
    reviewsCount: 652,
    category: "smartwatches",
    parentCategory: "wearables",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Titanium Silver", code: "#94a3b8" },
      { name: "Aero Gold", code: "#f59e0b" },
      { name: "Starlight Dark", code: "#1e293b" },
    ],
    specifications: {
      Display: "1.43-inch Curved AMOLED (466x466 px)",
      Material: "Aerospace Titanium & Sapphire Crystal Glass",
      "Water Resistance": "5ATM (Up to 50 meters)",
      "Battery Life": "Up to 7 days in Smart Mode, 21 days in Classic Mode",
      Sensors: "Optical Heart Rate, SpO2, ECG, Accelerometer, Barometer",
    },
    features: [
      "Sapphire crystal display protection",
      "Advanced ECG and sleep cycle diagnostics",
      "Offline GPS tracking with mapping engine",
      "NFC contactless payment integration",
    ],
    stock: 5,
    freeDelivery: true,
    estimatedDelivery: "Tomorrow, by 2 PM",
    returnPolicy: "30-day Free Returns & Replacements",
    brand: "Apple",
    trending: true,
    bestSeller: true,
  },
  {
    id: "wear-02",
    name: "PulseFit Band Active",
    tagline: "Track what matters. Achieve more.",
    description:
      "The PulseFit Band Active is a lightweight, ergonomic fitness tracker built to monitor your activity, sleep, and recovery. Equipped with an ultra-bright OLED screen, it logs workouts, blood oxygen levels, and stress indexes automatically.",
    price: 120,
    discountPrice: 89,
    discount: 25,
    rating: 4.4,
    reviewsCount: 310,
    category: "fitness",
    parentCategory: "wearables",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Neon Orange", code: "#ff6b00" },
      { name: "Slate Black", code: "#334155" },
    ],
    specifications: {
      Battery: "Up to 14 days of power",
      Sensors: "Heart rate, Sleep analyzer, Step counter",
      Weight: "Under 20 grams",
    },
    features: [
      "24/7 Heart rate & Blood Oxygen metrics",
      "Over 30 sports tracking modes",
      "Quick text replies and notifications sync",
    ],
    stock: 25,
    freeDelivery: false,
    estimatedDelivery: "Wednesday, July 8",
    returnPolicy: "10-day replacement policy",
    brand: "Nike",
  },

  // LUXURY TIMEPIECES
  {
    id: "lux-01",
    name: "Vanguard Chronograph Lux",
    tagline: "Crafted for generations.",
    description:
      "Designed for the sophisticated connoisseur. The Vanguard Chronograph Lux represents the absolute peak of horological excellence. Boasting a mechanical, self-winding movement housed in an exquisite 18-karat rose gold alloy shell, this watch is as much an heirloom as it is an statement.",
    price: 24500,
    discountPrice: 19800,
    discount: 19,
    rating: 4.95,
    reviewsCount: 104,
    category: "timepieces",
    parentCategory: "luxury",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Rose Gold Dial", code: "#c084fc" },
      { name: "Deep Navy Dial", code: "#1e3a8a" },
      { name: "Emerald Sunburst", code: "#065f46" },
    ],
    specifications: {
      Movement: "NexCalibre Self-Winding Chronograph Automatic",
      "Power Reserve": "72 Hours",
      "Case Diameter": "41mm",
      Glass: "Scratch-Resistant Curved Sapphire Crystal",
      Strap: "Alligator Leather with Deployant Clasp",
    },
    features: [
      "Individually hand-crafted Swiss automatic movements",
      "Super-LumiNova luminescence on indices and hands",
      "Anti-reflective coatings on watch faces",
      "Limited batch production (strictly numbered)",
    ],
    stock: 2,
    freeDelivery: true,
    estimatedDelivery: "Monday, July 6 (Insured Delivery)",
    returnPolicy: "30-day Free Insured Return & Replacements",
    brand: "Rolex",
    trending: true,
    bestSeller: true,
  },
  {
    id: "lux-02",
    name: "Classic Heritage Monolith",
    tagline: "Timeless geometry.",
    description:
      "The Classic Heritage Monolith pays homage to minimalist design, featuring a slim case profile and a pristine ceramic bezel. The automatic movement runs with flawless precision.",
    price: 1500,
    discountPrice: 1290,
    discount: 14,
    rating: 4.7,
    reviewsCount: 92,
    category: "timepieces",
    parentCategory: "luxury",
    images: [
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Midnight Ceramic", code: "#0f172a" },
      { name: "Silver Oyster", code: "#cbd5e1" },
    ],
    specifications: {
      Movement: "Japanese quartz automatic",
      "Water Resistance": "100 meters (10ATM)",
      "Strap Width": "20mm",
    },
    features: [
      "Ultra-durable polished ceramic case body",
      "Screw-down crown with security indicators",
      "Quick-release custom steel strap system",
    ],
    stock: 4,
    freeDelivery: true,
    estimatedDelivery: "Tuesday, July 7",
    returnPolicy: "30-day returns policy",
    brand: "Rolex",
    newArrival: true,
  },

  // FASHION MENSWEAR
  {
    id: "fash-m01",
    name: "Urban Explorer Parka",
    tagline: "Conquer the elements.",
    description:
      "Engineered to keep you dry and warm in the harshest environments. This parka utilizes a multilayer technical membrane that blocks freezing winds and driving rain while allowing internal moisture to escape, keeping you perfectly ventilated.",
    price: 299,
    discountPrice: 229,
    discount: 23,
    rating: 4.7,
    reviewsCount: 310,
    category: "menswear",
    parentCategory: "fashion",
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Stealth Olive", code: "#365314" },
      { name: "Concrete Grey", code: "#475569" },
      { name: "Storm Black", code: "#0f172a" },
    ],
    sizes: ["S", "M", "L", "XL"],
    specifications: {
      Material: "85% Recycled Polyester, 15% Waterproof Nylon",
      Rating: "IPX6 Wind and Rain Protection",
      Pockets: "6 external water-sealed utility pockets, 2 internal pockets",
      Fit: "Ergonomic regular fit with drawcord adjustability",
    },
    features: [
      "Thermoregulating synthetic alternative down lining",
      "Detachable insulated hood with brim",
      "Reflective accents for safety in low light",
    ],
    stock: 14,
    freeDelivery: true,
    estimatedDelivery: "Wednesday, July 8",
    returnPolicy: "30-day Free Size Swaps & Returns",
    brand: "Nike",
    trending: true,
  },
  {
    id: "fash-w01",
    name: "AeroKnit Blazer Dress",
    tagline: "Effortless versatility.",
    description:
      "Designed for the modern woman on the go. The AeroKnit Blazer Dress seamlessly transitions from office wear to high-end social dinners. Knit with structured organic cotton yarn that resists creasing and moves with you.",
    price: 180,
    discountPrice: 145,
    discount: 19,
    rating: 4.8,
    reviewsCount: 154,
    category: "womenswear",
    parentCategory: "fashion",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Crimson Blush", code: "#f43f5e" },
      { name: "Alabaster White", code: "#fafaf9" },
      { name: "Onyx Black", code: "#1c1917" },
    ],
    sizes: ["XS", "S", "M", "L"],
    specifications: {
      Material: "65% Organic Cotton, 30% Lyocell, 5% Spandex",
      Care: "Machine washable, low heat drying",
      Weight: "Medium-weight premium knit",
    },
    features: [
      "Wrinkle-resistant double-knit structured fabrication",
      "Sleek asymmetrical metal hardware detail",
      "Hidden interior safety button lock",
    ],
    stock: 8,
    freeDelivery: true,
    estimatedDelivery: "Monday, July 6",
    returnPolicy: "30-day Free Returns",
    brand: "Nike",
    trending: true,
  },

  // SHOES
  {
    id: "fash-s01",
    name: "HyperGlide Elements V2",
    tagline: "Propel your stride.",
    description:
      "Engineered with futuristic foam-mesh lattices. The HyperGlide Elements V2 sneakers offer unprecedented energy return and cushioning. The custom knitted upper hugs your foot like a second skin, offering breathability and custom lock-ins.",
    price: 250,
    discountPrice: 195,
    discount: 22,
    rating: 4.85,
    reviewsCount: 940,
    category: "shoes",
    parentCategory: "fashion",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Electric Orange", code: "#ea580c" },
      { name: "Cyber Neon Green", code: "#84cc16" },
      { name: "Triple Obsidian", code: "#030712" },
    ],
    sizes: ["8", "9", "10", "11", "12"],
    specifications: {
      "Sole Material": "HyperGlide Carbon-infused Foam Sole",
      Upper: "Engineered FlyKnit Mesh",
      "Heel Drop": "8mm",
      Pronation: "Neutral support alignment",
    },
    features: [
      "Responsive carbon fiber acceleration plate",
      "Shock absorption heel cushioning pods",
      "Reflective laces and rear heel loops",
    ],
    stock: 15,
    freeDelivery: true,
    estimatedDelivery: "Tomorrow, by 5 PM",
    returnPolicy: "30-day free testing return window",
    brand: "Nike",
    trending: true,
    bestSeller: true,
    dealOfTheDay: true,
  },

  // HOME FURNITURE
  {
    id: "home-f01",
    name: "Helix Ergonomic Swivel Chair",
    tagline: "Comfort redefined for creators.",
    description:
      "The ultimate seating machine. Featuring a dynamic spinal support system that adjusts automatically to your movements, high-res mesh ventilation, and customized 4D armrest controls, the Helix Chair lets you work comfortably for hours.",
    price: 699,
    discountPrice: 549,
    discount: 21,
    rating: 4.75,
    reviewsCount: 420,
    category: "furniture",
    parentCategory: "home",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Aluminium Silver Frame", code: "#cbd5e1" },
      { name: "Obsidian Black Mesh", code: "#020617" },
    ],
    specifications: {
      "Base Material": "Aircraft-grade die-cast Aluminium",
      "Weight Capacity": "Up to 150 kg",
      "Recline Range": "90° to 135° locking positions",
      Armrests: "4D adjustability (Height, angle, width, slide)",
    },
    features: [
      "Dynamic Lumbar adaptive support system",
      "Breathable high-strength elastomer mesh",
      "Heavy-duty castors optimized for hardwood & carpet",
    ],
    stock: 3,
    freeDelivery: true,
    estimatedDelivery: "Thursday, July 9",
    returnPolicy: "30-day Free Trial & returns",
    brand: "Dyson",
    trending: true,
  },
  {
    id: "home-a01",
    name: "Vortex Air Purifier Hot+Cool",
    tagline: "Clean air. Perfect temperature.",
    description:
      "Purify and regulate your home air with extreme intelligence. The Vortex Purifier dynamically senses air quality particles (PM2.5, PM10, VOCs) in real-time, capturing 99.97% of fine allergens while blowing cool or heated clean air.",
    price: 650,
    discountPrice: 580,
    discount: 10,
    rating: 4.8,
    reviewsCount: 228,
    category: "appliances",
    parentCategory: "home",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    ],
    threeSixtyImages: gen360Angles(
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    ),
    colors: [
      { name: "Iron Blue", code: "#1e3a8a" },
      { name: "Sleek White Silver", code: "#e2e8f0" },
    ],
    specifications: {
      Coverage: "Up to 800 sq ft room size",
      "HEPA Rating": "True HEPA H13 Glass Filtration",
      "Noise Level": "Super quiet 20dB Night Mode",
    },
    features: [
      "Simultaneous HEPA filtration, cooling fan & heater",
      "Live LCD display tracking air metrics in real-time",
      "Full app integration with Alexa/Siri voice control",
    ],
    stock: 7,
    freeDelivery: true,
    estimatedDelivery: "Monday, July 6",
    returnPolicy: "30-day replacement policy",
    brand: "Dyson",
    newArrival: true,
  },
];

// Let's programmatically generate more products to hit 50 products easily!
// We'll create duplicates or variations across subcategories with unique IDs, names, images, and prices
const extraSubCategories = [
  "audio",
  "cameras",
  "accessories",
  "smartwatches",
  "fitness",
  "timepieces",
  "accessories-lux",
  "menswear",
  "womenswear",
  "shoes",
  "furniture",
  "appliances",
];
const unsplashCollections = {
  audio: [
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80",
  ],
  cameras: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510127852285-594c98e29dc9?w=800&auto=format&fit=crop&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1622445262465-2481c457487f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
  ],
  smartwatches: [
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=80",
  ],
  fitness: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557330359-ffb0deed6163?w=800&auto=format&fit=crop&q=80",
  ],
  timepieces: [
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1639006570490-79c0c53f1080?w=800&auto=format&fit=crop&q=80",
  ],
  "accessories-lux": [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1627124765135-56f3f0124254?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
  ],
  menswear: [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
  ],
  womenswear: [
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80",
  ],
  furniture: [
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
  ],
  appliances: [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80",
  ],
};

const subCategoryToParentMap = {
  audio: "electronics",
  cameras: "electronics",
  accessories: "electronics",
  smartwatches: "wearables",
  fitness: "wearables",
  timepieces: "luxury",
  "accessories-lux": "luxury",
  menswear: "fashion",
  womenswear: "fashion",
  shoes: "fashion",
  furniture: "home",
  appliances: "home",
};

const adjectives = [
  "Apex",
  "Omni",
  "Quantum",
  "Zephyr",
  "Luxe",
  "Veloce",
  "Aero",
  "Horizon",
  "Infinity",
  "Helios",
  "Vector",
  "Carbon",
];
const productTypes = {
  audio: ["Wireless Headphones", "Studio Speakers", "Soundbars", "Pocket Buds"],
  cameras: [
    "Vlog Mirrorless Camera",
    "Cinematic Action Cam",
    "Pro Gimbal Stabilizer",
  ],
  accessories: [
    "MagSafe Charger Pad",
    "Super-fast Charging Hub",
    "Thunderbolt 4 Cable",
  ],
  smartwatches: [
    "Elite Smart Watch",
    "Classic Chrono Smart",
    "Carbon Hybrid Watch",
  ],
  fitness: ["Sport Tracker Pro", "Active Band Slim", "Heart Rate Ring"],
  timepieces: ["Oyster Chronometer", "Executive Automatic", "Nautilus Classic"],
  "accessories-lux": [
    "Saddle Leather Briefcase",
    "Luxury Travel Wallet",
    "Slim Calfskin Cardholder",
  ],
  menswear: [
    "Tech-Fleece Hoodie",
    "Minimalist Merino Sweater",
    "Structured Oxford Shirt",
  ],
  womenswear: [
    "Silk Drapery Trench",
    "Linen Shift Dress",
    "Tailored Pleated Trouser",
  ],
  shoes: [
    "Knit Cushioned Trainers",
    "High-Top Element Sneakers",
    "Low-Profile Skate Shoes",
  ],
  furniture: [
    "Oak Drafting Desk",
    "Boucle Accent Lounge",
    "Floating Media Console",
  ],
  appliances: [
    "Espresso Micro-Brewer",
    "Multi-cyclone Hand Vacuum",
    "Smart Aromatherapy Diffuser",
  ],
};

const brandsPool = ["Sony", "Apple", "Bose", "Rolex", "Dyson", "Nike"];

// Programmatically generate another 42 products to reach 50+ items total!
for (let i = 1; i <= 42; i++) {
  const subCategory = extraSubCategories[i % extraSubCategories.length];
  const parentCategory = subCategoryToParentMap[subCategory];
  const adj = adjectives[i % adjectives.length];
  const types = productTypes[subCategory];
  const type = types[i % types.length];
  const name = `${adj} ${type}`;
  const brand = brandsPool[i % brandsPool.length];
  const imgs = unsplashCollections[subCategory] || [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
  ];
  const basePrice = Math.floor(
    50 + i * 37 + (subCategory === "timepieces" ? 1200 : 0),
  );
  const discountPercent = Math.floor(10 + ((i * 3.7) % 30));
  const discountPrice = Math.floor(basePrice * (1 - discountPercent / 100));
  PRODUCTS.push({
    id: `gen-prod-${i}`,
    name,
    tagline: `Experience premium ${type.toLowerCase()} craftsmanship.`,
    description: `A masterfully designed ${name} engineered with high-grade durable components. Combining modern design, cutting edge electronics, and elegant finishes for daily use.`,
    price: basePrice,
    discountPrice,
    discount: discountPercent,
    rating: parseFloat((4.0 + ((i * 0.17) % 1.0)).toFixed(2)),
    reviewsCount: Math.floor(12 + i * 29),
    category: subCategory,
    parentCategory,
    images: [imgs[i % imgs.length], imgs[(i + 1) % imgs.length] || imgs[0]],
    threeSixtyImages: gen360Angles(imgs[i % imgs.length]),
    colors: [
      { name: "Slate Grey", code: "#334155" },
      { name: "Chalk White", code: "#f8fafc" },
      { name: "Sienna Orange", code: "#ea580c" },
    ],
    sizes:
      subCategory === "menswear" || subCategory === "womenswear"
        ? ["S", "M", "L", "XL"]
        : subCategory === "shoes"
          ? ["8", "9", "10", "11"]
          : undefined,
    specifications: {
      "Model Range": `${adj} Series ${i}`,
      Warranty: "2 Year Limited Warranty",
      "Material Composition": "Sustainable recycled alloys & polymers",
      Origin: "Designed in California",
    },
    features: [
      "Ultra-durable hardware construction",
      "High integration with NexCart device ecosystems",
      "Eco-friendly recycled packaging",
    ],
    stock: i % 5 === 0 ? Math.floor(1 + (i % 3)) : Math.floor(10 + i), // seed some limited stock products
    freeDelivery: i % 2 === 0,
    estimatedDelivery: `Wednesday, July ${8 + (i % 4)}`,
    returnPolicy: "30-day Free Return Policy",
    brand,
    trending: i % 3 === 0,
    bestSeller: i % 5 === 0,
    newArrival: i % 4 === 0,
    dealOfTheDay: i % 7 === 0,
  });
}

// Inject standard reviews into all products
PRODUCTS.forEach((p) => {
  p.reviews = [...MOCK_REVIEWS];
});
