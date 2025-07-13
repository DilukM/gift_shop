# GiftBloom - Graduation Gift Shop

A modern, luxury e-commerce website specializing in graduation teddy bears and flower bouquets. Built with React, Tailwind CSS, and Framer Motion following Clean Code Architecture principles.

## 🏗️ Architecture

This project follows **Clean Code Architecture** with feature-based organization:

### 📁 Project Structure
```
src/
├── features/                    # Feature-based modules
│   ├── products/               # Product management feature
│   │   ├── presentation/       # UI components and pages
│   │   │   ├── components/     # Product-related components
│   │   │   └── pages/          # Product pages (Store, ProductDetails, Gallery)
│   │   ├── application/        # Application services
│   │   │   └── services/       # ProductsService
│   │   ├── domain/             # Business logic
│   │   │   ├── entities/       # Product entity
│   │   │   └── usecases/       # Product use cases
│   │   └── data/               # Data access layer
│   │       ├── repositories/   # Products repository
│   │       └── datasources/    # Data sources (JSON, API)
│   ├── cart/                   # Shopping cart feature
│   │   ├── presentation/       # Cart UI components
│   │   ├── application/        # CartService
│   │   ├── domain/             # Cart entities and use cases
│   │   └── data/               # Cart repository (localStorage)
│   ├── home/                   # Homepage feature
│   └── contact/                # Contact feature
├── shared/                     # Shared utilities and components
│   ├── components/             # Common UI components (Navbar, Footer)
│   ├── context/                # React contexts
│   ├── styles/                 # Shared styles and theme
│   └── utils/                  # Utility functions
└── App.jsx                     # Main application component
```

### 🎯 Clean Architecture Layers

1. **Presentation Layer** - React components, pages, and UI logic
2. **Application Layer** - Services coordinating business operations
3. **Domain Layer** - Business entities, use cases, and core logic
4. **Data Layer** - Repositories and data sources

## 🌟 Features

- **Modern Hero Section** - Eye-catching landing page with animations
- **Product Catalog** - Browse graduation teddy bears, flower bouquets, and gift combos
- **Shopping Cart** - Full cart functionality with local storage persistence
- **Product Filtering** - Search, filter by category, price range, and sort options
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Customer Testimonials** - Social proof section with reviews
- **Contact Forms** - Get in touch for custom orders

## 🎨 Design

- **Color Scheme**: Maroon primary colors (#d33e3e) with gold accents (#f59e0b)
- **Typography**: Inter font family for modern, clean readability
- **Style**: Luxury aesthetic with rounded corners, shadows, and gradients
- **Animations**: Smooth transitions and hover effects throughout

## 🛠️ Tech Stack

- **React** - Modern functional components with hooks
- **React Router** - Client-side routing for SPA navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.11.0 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🧪 Development Guidelines

### Adding New Features
1. Create feature folder in `src/features/`
2. Follow the clean architecture layers:
   - `presentation/` - UI components and pages
   - `application/` - Services and application logic
   - `domain/` - Entities and use cases
   - `data/` - Repositories and data sources
3. Export main components in feature's `index.js`

### Code Organization
- **Entities**: Core business objects (Product, Cart, etc.)
- **Use Cases**: Business operations (AddToCart, SearchProducts, etc.)
- **Services**: Application layer coordinating multiple use cases
- **Repositories**: Data access interfaces
- **Components**: UI presentation layer

Built with ❤️ for celebrating academic achievements+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
