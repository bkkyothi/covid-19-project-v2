# COVID-19 Dashboard V2

A comprehensive, interactive COVID-19 Dashboard built with **Nuxt 3**, **TypeScript**, **Leaflet**, and **ApexCharts**. It features real-time data visualization, interactive maps, and a persistent theme system using **DaisyUI**.

## ✨ Features

- **Global Overview**: Real-time statistics on cases, deaths, and recoveries.
- **Interactive Maps**:
  - **Continents Map**: Choropleth map coloring continents by case density.
  - **Vaccination Map**: Choropleth map showing global vaccination rollout.
- **Data Visualization**:
  - **ApexCharts**: Timeseries (Area/Line), Donut, and Scatter plots.
  - **Leaflet**: Geographic data visualization with custom tooltips.
- **Country Details**:
  - Searchable country grid with advanced filtering.
  - Detailed modal with fatality risk indicators (OOP logic).
- **Vaccination Tracking**: Dedicated page for vaccine distribution and top performing countries.
- **Advanced Theming**:
  - **Persistence**: Remembers your theme preference (Light/Dark/System) via `localStorage`.
  - **30+ Themes**: Fully integrated with DaisyUI themes (Cyberpunk, Dracula, Winter, etc.).
- **Architecture**:
  - **DDD-inspired**: Separation of concerns with Services, Models, Mappers, and Stores.
  - **Optimized**: In-memory API caching (`CacheService`) and persistent preferences (`StorageService`).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd covidProjectv2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
covidProjectv2/
├── app/
│   ├── charts/                # Chart configuration & factories
│   ├── components/
│   │   ├── continents/        # Continents Map & logic
│   │   ├── countries/         # Country Grid & Detail Modal
│   │   ├── dashboard/         # Dashboard panels (Charts, Summaries)
│   │   ├── layout/            # Sidebar, Header
│   │   ├── shared/            # Reusable UI (Loading, Error, ChartWrappers)
│   │   └── vaccines/          # Vaccine Map & Panels
│   ├── layouts/               # Nuxt layouts
│   ├── mappers/               # API -> Model transformers
│   ├── models/                # Domain Models (Business Logic)
│   ├── pages/                 # Application Routes
│   ├── plugins/               # Nuxt plugins (ApexCharts, etc.)
│   ├── services/              # Core Services (Api, Cache, Storage, Covid)
│   ├── stores/                # Pinia Stores (Data & Theme)
│   ├── types/                 # TypeScript interfaces
│   └── app.vue                # Root component
├── public/                    # Static assets (GeoJSON)
├── server/                    # Server (API proxy if needed)
├── tests/                     # Vitest suites
├── nuxt.config.ts             # Nuxt configuration
└── tailwind.config.js         # Tailwind & DaisyUI config
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Core** | Nuxt 3, Vue 3, TypeScript |
| **State** | Pinia (Stores) |
| **Networking** | Axios (Services Pattern) |
| **Maps** | Leaflet, GeoJSON |
| **Charts** | ApexCharts, Vue3-ApexCharts |
| **Styling** | TailwindCSS, DaisyUI |
| **Testing** | Vitest |

## 🏗 Architecture Highlights

### 1. Service Layer
- **CovidService**: Orchestrates data fetching, mapping, and caching.
- **ApiService**: Handles HTTP communication with interceptors.
- **StorageService**: Manages persistent user preferences (localStorage).
- **CacheService**: Handles in-memory caching for API responses.

### 2. Domain Models
Business logic is encapsulated in Models, not Components.
- `CountryData`: Calculates `fatalityRisk` class.
- `ContinentData`: Determines map `color` based on cases.
- `VaccineCoverage`: Processes timeline data for charts.

### 3. Theme System
The `useThemeStore` manages the active theme utilizing `StorageService` for persistence. It syncs automatically with Tailwind's dark mode via `data-theme` attribute and system preferences.

## � Data Sources

All COVID-19 data is provided by [disease.sh](https://disease.sh/).
- Global Stats: `/v3/covid-19/all`
- Historical: `/v3/covid-19/historical`
- Vaccines: `/v3/covid-19/vaccine/coverage`
- GeoData: Sourced from public GeoJSON repositories (e.g. `countries.geo.json`).

## 📄 License

MIT License.
