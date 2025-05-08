
# MO-180 Sales Simulator Project Structure

```
MO180SalesSimulator/
├── src/                  # Source code
│   ├── components/       # React components 
│   │   ├── InputPanel/   # Left panel with form inputs
│   │   ├── ResultsPanel/ # Right panel with calculation results
│   │   └── Layout/       # Page layout components
│   ├── utils/            # Utility functions
│   │   ├── calculations.js # Core calculation logic
│   │   └── validators.js   # Input validation
│   ├── config/           # Configuration files
│   │   ├── printers.json  # Printer specifications (Phase 2)
│   │   └── i18n/         # Language files (Phase 2)
│   │       ├── en.json    # English translations
│   │       └── jp.json    # Japanese translations
│   ├── assets/           # Static assets
│   │   ├── images/       # Images and icons
│   │   └── styles/       # Global CSS
│   └── services/         # API services (Phase 2)
│       └── pdfGenerator.js # PDF export service
├── public/              # Public assets 
│   ├── index.html       # HTML entry point
│   └── favicon.ico      # Site favicon
├── build/               # Production build folder
├── tests/               # Test files
├── package.json         # Dependencies and scripts
├── README.md            # Project documentation
└── LICENSE              # License information
```
