# 🛒 NexCart — Premium E-Commerce Experience

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-F024B6?logo=framer&logoColor=white&style=for-the-badge)](https://www.framer.com/motion/)

Discover **NexCart**, a futuristic, luxury, and high-fidelity shopping platform prototype designed for modern digital commerce. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and animated with **Framer Motion**, NexCart delivers a state-of-the-art retail showcase with immersive components.

---

## ✨ Key Features

### 🌌 Immersive Experience
- **Cinematic Splash Screen:** A beautiful grid/circuit-patterned entryway featuring floating canvas particles, color accents, and a dynamic loading indicator.
- **Dual Premium Theme System:** Seamless transition between a sleek luxury light mode and an immersive neon dark mode.

### 🔍 Next-Gen Search Suite (Simulators)
- **🎙️ Voice Search:** Mimics real-time voice speech parsing using speech-recognition UI patterns to quickly find audio devices and wearables.
- **📷 Image Search:** Upload or select sample products, triggering simulated object bounding boxes, AI confidence scoring, and search parsing.
- **🛡️ Barcode & QR Scanner:** A camera viewfinder simulator with target framing and scanning animations that match and locate items.

### 🛍️ Premium Commerce Engine
- **📦 360° Product Viewer:** Explore products from every angle with interactive, mouse-controlled, rotatable 360° image arrays.
- **🏷️ Interactive Category Navigation:** A gorgeous slide-out drawer categorization menu with hierarchical sub-categories.
- **⚡ Flash Sales & Quick View:** Real-time countdown timers and details modals to inspect products instantly.
- **⚖️ Side-by-Side Product Comparison:** Add items to a comparison table to compare prices, ratings, features, and key specifications.
- **🛒 High-Fidelity Cart:** Add, remove, update quantities, apply coupon codes, and calculate instant totals.
- **💳 Multi-Step Checkout:** A guided shipping, billing, and order confirmation flow topped off with custom confetti celebrations.

### 💬 Support & Personalization
- **👤 User Profile & Order Hub:** Manage shipping address, payment methods, order history, and support queries.
- **🤖 Floating AI Chat Assistant:** Interactive customer service chat module with pre-loaded options and smart typing states.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://react.dev/) (Functional Components, Custom Hooks, Context API)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for robust static typing
- **Build Tool & Dev Server:** [Vite](https://vitejs.dev/) for instant HMR (Hot Module Replacement)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (using CSS variables for dark mode support) & [PostCSS](https://postcss.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid page transitions, slide-out menus, and modal pop-ups
- **Icons:** [Lucide React](https://lucide.dev/) for sharp, customizable SVG icons
- **Effects:** [Canvas Confetti](https://github.com/catdad/canvas-confetti) for checkout celebrations

---

## 📁 Project Structure

```text
nexus/
├── public/                 # Static assets (images, logos, etc.)
├── src/
│   ├── components/         # Reusable UI Components
│   │   ├── CategoryNav.tsx       # Slide-out category drawer
│   │   ├── ChatSupport.tsx       # Floating support chat widget
│   │   ├── FlashSale.tsx         # Countdown and flash deals
│   │   ├── Header.tsx            # Sticky global header and controls
│   │   ├── HeroCarousel.tsx      # Main promotional carousel
│   │   ├── ProductCard.tsx       # Grid cards with quick buy actions
│   │   ├── QuickViewModal.tsx    # Modal view for fast inspects
│   │   └── SkeletonCard.tsx      # Loading state skeletons
│   ├── context/            # Global State Managers
│   │   ├── CartContext.tsx       # Items list, operations, and coupons
│   │   └── ThemeContext.tsx      # Dark and Light mode state
│   ├── data/               # Static Mock Datasets
│   │   └── mockData.ts           # Product details, reviews, specifications
│   ├── pages/              # Application Pages
│   │   ├── Cart.tsx              # Detailed cart review page
│   │   ├── Checkout.tsx          # Multi-step checkout form
│   │   ├── Compare.tsx           # Side-by-side product comparing
│   │   ├── Home.tsx              # Landing catalog with filter panel
│   │   ├── ProductDetails.tsx    # 360° viewer, reviews tab, and details
│   │   ├── Profile.tsx           # Dashboard, orders, & customer details
│   │   └── SplashScreen.tsx      # Immersive launch loader
│   ├── App.tsx             # Hash-routing coordinator
│   ├── index.css           # Global custom utilities & theme definitions
│   ├── main.tsx            # DOM mounting entrypoint
│   └── shims.d.ts          # Module type declarations
├── postcss.config.js       # PostCSS config (Autoprefixer)
├── tailwind.config.js      # Tailwind configurations & colors
├── tsconfig.json           # TypeScript configuration compiler rules
└── vite.config.ts          # Vite build plugin config
```

---

## 🚀 Getting Started

Follow these steps to run NexCart locally on your computer.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nexcart.git
cd nexcart
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Start the Development Server

Launch the local development server:

```bash
npm run dev
```

Once running, open your browser and navigate to the address shown in your terminal (usually `http://localhost:5173`).

### 4. Build for Production

To compile and bundle the project for production deployment:

```bash
npm run build
```

This generates a optimized static production bundle in the `dist` directory. You can preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Development & Code Quality

To format, check, and lint the code, run:

```bash
npm run lint
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

*Made with ❤️ for showcases, portfolios, and demonstration presentations.*
