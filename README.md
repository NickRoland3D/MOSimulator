# MO-180 Sales Simulator (Final Enhanced UI/UX)

A modern web application designed for potential buyers and sales teams to simulate the revenue, costs, and profitability of operating the Roland DG MO-180 UV printer. This final version features an intuitive interface with interactive charts, visual feedback, and CMYK color accents for a professional and engaging user experience.

## Key Features

### Modern & Intuitive Interface

* **Minimalist Design** with carefully placed CMYK color accents
* **Card-based Layout** for clear visual organization
* **Micro-interactions** and subtle animations for a polished feel
* **Responsive Design** for all screen sizes (desktop, tablet, mobile)

### Enhanced Input Controls

* **Product Dimensions** with steppers (5mm increments)
* **Price Parameters** with tailored steppers (Sales Price: 50 JPY, Material Cost: 10 JPY, Labor Cost: 100 JPY, Ink Price: 1 JPY)
* **Monthly Sales Volume** with integrated slider and numeric input
* **CMYK Highlights** on focused input fields
* **Printer Specifications** accessible via info icon (ⓘ)

### Dynamic Results Visualization

* **Real-time Updates** as inputs change
* **Status Tag & Background Color** based on investment quality
* **Interactive Chart Area** with CMYK-colored tabs:
  * **Payback Period Gauge** (Cyan) - Visual representation of ROI timeframe
  * **Cost Breakdown Chart** (Magenta) - Donut chart of material, ink, and labor costs
  * **Profit vs. Volume Chart** (Yellow) - Line chart showing profit potential

### Financial Metrics & Production Details

* **Key Financial Figures** prominently displayed
* **Organized Detail Cards** for production and ink usage information
* **Clear Formatting** for currency values and percentages

## Technology Stack

* **Frontend**: React.js with Material UI
* **State Management**: React Hooks
* **Styling**: Custom theme with CMYK palette
* **Charts**: Custom Canvas-based visualizations
* **Animations**: CSS transitions and keyframe animations

## Calculations & Data

The simulator performs a variety of calculations to determine profitability:

* **Items per Print Job** based on product dimensions and printable area
* **Ink Usage** calculated using scaling formula
* **Costs** (material, ink, labor) combined for total cost per unit
* **Profit Metrics** including monthly gross profit and margin
* **Payback Period** for investment recovery estimation

## Setup & Usage

### Installation

```bash
cd /Users/nicholasgobert/Desktop/Apps/MO180SalesSimulator
npm install
npm start
```

### How to Use

1. **Adjust Input Parameters**:
   * Set product dimensions (Short Edge, Long Edge)
   * Modify prices and costs (Sales Price, Material Cost, Labor Cost, Ink Price)
   * Set monthly sales volume using the slider or direct input
   * View printer specs by clicking the info icon (ⓘ)

2. **Review Results**:
   * Observe key metrics and the status tag
   * Note the background color indicating investment quality
   * Explore the different charts using the tabs
   * Review detailed production and ink usage information

3. **Phase 2 Features** (Coming Soon):
   * Multi-language support (English/Japanese)
   * PDF export functionality
   * Multi-model support
   * Region-based configuration

## Design Philosophy

The interface follows a modern, minimalist approach with subtle CMYK color accents inspired by the printing industry. The design prioritizes clarity and usability while maintaining visual appeal, making complex financial calculations accessible to both sales representatives and potential customers.

## Credits

Developed for Roland DG Corporation to assist in the sales process for the MO-180 UV printer.

© 2025 Roland DG Corporation
