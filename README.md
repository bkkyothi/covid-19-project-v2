# COVID-19 Dashboard (covidProjectV2)

A comprehensive COVID-19 Dashboard built with Nuxt 3, TypeScript, ApexCharts, and DaisyUI featuring real-time data from the disease.sh API.

![Dashboard Preview](./docs/preview.png)

## ✨ Features

- **Real-time Data**: Fetches live COVID-19 statistics from disease.sh API
- **Interactive Charts**: Timeseries, Pie/Donut, and Scatter charts with ApexCharts
- **Responsive Design**: Mobile-friendly layout with DaisyUI components
- **Dark Mode**: Built-in dark theme with toggle support
- **In-Memory Caching**: Optimized API calls with TTL-based cache
- **TypeScript**: Fully typed codebase with strict mode
- **OOP Architecture**: Clean separation with Services, Models, Mappers, and Charts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd covidProjectv2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
covidProjectv2/
├── charts/                    # Chart configuration classes
│   ├── BaseChartConfig.ts     # Abstract base chart class
│   ├── TimeseriesChart.ts     # Line/Area chart for timeseries
│   ├── PieChart.ts            # Pie/Donut chart
│   ├── ScatterChart.ts        # Scatter chart
│   └── ChartFactory.ts        # Factory for chart creation
│
├── components/
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── SummaryCard.vue    # Statistics card
│   │   ├── TimeseriesPanel.vue
│   │   ├── PiePanel.vue
│   │   ├── ScatterPanel.vue
│   │   └── TopCountriesTable.vue
│   ├── layout/                # Layout components
│   │   ├── Sidebar.vue
│   │   └── Header.vue
│   └── shared/                # Reusable components
│       ├── LoadingSpinner.vue
│       ├── ErrorAlert.vue
│       ├── ErrorBoundary.vue
│       └── ChartWrapper.vue
│
├── layouts/
│   └── default.vue            # Main layout with sidebar
│
├── mappers/                   # API → Model transformers
│   ├── GlobalSummaryMapper.ts
│   ├── HistoricalDataMapper.ts
│   ├── CountryDataMapper.ts
│   └── ...
│
├── models/                    # Domain models (OOP pattern)
│   ├── GlobalSummary.ts       # Global statistics model
│   ├── HistoricalData.ts      # Timeseries data model
│   ├── CountryData.ts         # Country data model
│   └── ...
│
├── pages/
│   └── index.vue              # Main dashboard page
│
├── plugins/
│   └── apexcharts.client.ts   # ApexCharts Vue plugin
│
├── services/                  # API & business logic
│   ├── ApiService.ts          # Axios instance + interceptors
│   ├── CacheService.ts        # In-memory cache with TTL
│   └── CovidService.ts        # COVID API methods
│
├── stores/
│   └── useCovidStore.ts       # Pinia store for state
│
├── types/                     # TypeScript types
│   ├── api/                   # API response types
│   ├── chart/                 # Chart configuration types
│   └── common/                # Utility types (ApiState, etc.)
│
├── tests/
│   └── CovidService.test.ts   # Unit tests
│
├── nuxt.config.ts
├── tailwind.config.js
└── package.json
```

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Nuxt 3** | Vue.js framework with SSR support |
| **TypeScript** | Type-safe JavaScript |
| **Pinia** | State management |
| **Axios** | HTTP client with interceptors |
| **ApexCharts** | Interactive charting library |
| **TailwindCSS** | Utility-first CSS framework |
| **DaisyUI** | Tailwind component library |
| **Vitest** | Unit testing framework |

## 📊 API Endpoints Used

All data is fetched from [disease.sh](https://disease.sh/):

| Endpoint | Description |
|----------|-------------|
| `/v3/covid-19/all` | Global summary statistics |
| `/v3/covid-19/historical/all` | Historical timeseries data |
| `/v3/covid-19/countries` | Per-country statistics |
| `/v3/covid-19/continents` | Per-continent statistics |
| `/v3/covid-19/states` | US state statistics |
| `/v3/covid-19/vaccine/coverage` | Vaccine coverage data |

## 🏗 Architecture

### Services Layer

- **ApiService**: Axios instance with request/response interceptors, retry logic
- **CacheService**: In-memory cache with configurable TTL (default 5 minutes)
- **CovidService**: Domain service that uses mappers to return Model instances

### Models

Each model class wraps the raw API response and provides:
- Typed getters for data access
- Computed properties (e.g., `fatalityRate`, `recoveryRate`)
- Helper methods (e.g., `toCard()`, `toTableRow()`)

### Charts

Chart classes extend `BaseChartConfig` and provide:
- Pre-configured dark theme
- Responsive settings
- Factory methods for common use cases

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## 🎨 Customization

### Theme

Edit `tailwind.config.js` to customize the DaisyUI theme:

```javascript
daisyui: {
  themes: [
    {
      covidDark: {
        'primary': '#3b82f6',
        'secondary': '#a855f7',
        // ... customize as needed
      },
    },
  ],
}
```

### Cache TTL

Modify cache duration in `services/CovidService.ts`:

```typescript
private cacheTTL = 5 * 60 * 1000; // 5 minutes
```

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🙏 Acknowledgments

- [disease.sh](https://disease.sh/) for the free COVID-19 API
- [ApexCharts](https://apexcharts.com/) for the charting library
- [DaisyUI](https://daisyui.com/) for the beautiful components
