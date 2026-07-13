# Kaizen Optima Solutions — Website

A three-page marketing site (Property Management, Cleaning Services, Aircon
Care) built to the **Serene Trust** design system, scaffolded with a strict
**MVVM (Model–View–ViewModel)** architecture.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (Serene Trust token set: navy/cream Material-3-derived palette,
  Montserrat display type, Inter body type)
- Framer Motion (scroll + entrance animations)
- React Router (three lazy-loaded routes)
- Google Material Symbols Outlined (icon font, rendered via `MaterialIcon`)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Pages

| Route                 | Page                |
|-----------------------|----------------------|
| `/`                    | Property Management  |
| `/cleaning-services`   | Cleaning Services     |
| `/aircon-care`         | Aircon Care           |

## Architecture

```
src/
├── main.tsx                     # React root
├── App.tsx                      # Router + 3 lazy-loaded page routes
├── index.css                    # Tailwind entry, fonts, global styles
├── shared/
│   ├── models/
│   │   ├── types.ts             # All domain interfaces (MODEL)
│   │   └── apiService.ts        # All data-fetching functions (MODEL)
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useScrollLock.ts
│   │   └── useSiteChromeViewModel.ts  # Shared nav/footer ViewModel (used by all 3 pages)
│   ├── utils/
│   │   └── constants.ts         # Framer Motion variants, site meta
│   └── components/
│       ├── Navbar.tsx           # Global navigation (route-aware active state)
│       ├── Footer.tsx           # Global 4-column footer
│       ├── PageLayout.tsx       # Wraps Navbar + Footer around page content
│       └── MaterialIcon.tsx     # Material Symbols icon-by-name renderer
└── features/
    ├── property-management/
    │   ├── viewModels/usePropertyManagementViewModel.ts
    │   └── views/ (PropertyManagement.tsx, Hero.tsx, ProcessSteps.tsx, WhyChooseUs.tsx)
    ├── cleaning-services/
    │   ├── viewModels/useCleaningServicesViewModel.ts
    │   └── views/ (CleaningServices.tsx, Hero.tsx, ServicesGrid.tsx)
    └── aircon-care/
        ├── viewModels/useAirconCareViewModel.ts
        └── views/ (AirconCare.tsx, Hero.tsx, CarePlans.tsx, Benefits.tsx, CTA.tsx)
```

### Rules followed

1. **Model** (`shared/models/`) — plain TypeScript only: interfaces + async
   data functions, one fetch function per page (`fetchPropertyManagementData`,
   `fetchCleaningServicesData`, `fetchAirconCareData`) plus a shared
   `fetchSiteChrome` for nav/footer content. No React/JSX.
2. **ViewModel** (`features/<page>/viewModels/`) — one hook per page that
   calls the Model, manages `useState`/`useEffect`, and returns
   `{ data, isLoading, error }`. The shared nav/footer chrome has its own
   ViewModel in `shared/hooks/` since 3 features consume it.
3. **View** (`features/<page>/views/*`) — components call the ViewModel hook
   for data. Local UI state (mobile menu open/closed) lives in the view.
4. Views never import `apiService` directly — only ViewModels do.
5. Cross-feature code (Navbar, Footer, PageLayout, icon renderer, hooks)
   lives in `shared/`.
6. All three pages are lazy-loaded in `App.tsx` via `React.lazy`.
7. Framer Motion drives section reveal motion, React Router owns the three
   routes, Tailwind implements every color/type/spacing/radius/shadow token
   from the Serene Trust design system (see `tailwind.config.js`).

## Design tokens

The full Serene Trust color, type, radius, spacing, and shadow scale lives in
`tailwind.config.js`, matching the provided design spec 1:1 (e.g. `primary`
`#002045`, `primary-container` `#1A365D`, `background` `#FAF9F6`, Montserrat
for headings, Inter for body/labels).

## Adding a new page/feature

1. Create `features/<name>/viewModels/use<Name>ViewModel.ts` and
   `features/<name>/views/<Name>.tsx` (+ section components).
2. Add any new data types/fetchers to `shared/models/`.
3. Register the page with `lazy(() => import(...))` and a new `<Route>` in
   `App.tsx`, and add it to `navLinks` / `footerGroups` in `apiService.ts`.
