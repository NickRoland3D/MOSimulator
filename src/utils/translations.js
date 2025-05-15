// Translation strings for English and Japanese
const translations = {
  en: {
    // App title and subtitle
    moSimulatorTitle: "MO-180 Cost Simulator",
    evaluateProfitability: "Evaluate profitability and ROI for the Roland DG MO-180 UV printer",
    allRightsReserved: "All rights reserved.",
    
    // Header
    simulationParameters: "Simulation Parameters",
    printerSpecifications: "Printer Specifications",
    
    // Dimensions section
    productDimensions: "Product Dimensions",
    shortEdge: "Short Edge",
    longEdge: "Long Edge",
    range: "Range",
    
    // Price section
    priceParameters: "Price Parameters",
    salesPricePerUnit: "Sales Price per Unit",
    materialCostPerUnit: "Material Cost per Unit",
    laborCostPerHour: "Labor Cost per Hour",
    inkPrice: "Ink Price",
    
    // Volume section
    monthlySalesVolume: "Monthly Sales Volume",
    monthlySalesTarget: "Monthly Sales Target",
    unitsPerMonth: "Units per month",

    // Results section
    simulationResults: "Simulation Results",
    monthlySales: "Monthly Sales",
    monthlyGrossProfit: "Monthly Gross Profit",
    grossProfitMargin: "Gross Profit Margin",
    investmentPaybackPeriod: "Investment Payback Period",
    costPerUnit: "Cost per Unit",
    operatingHours: "Operating Hours",
    hours: "hours",
    months: "months",
    productionDetails: "Production Details",
    itemsPerPrintJob: "Items per Print Job",
    monthlyPrintJobs: "Monthly Print Jobs",
    inkUsagePerItem: "Ink Usage per Item",
    white: "White",
    cmyk: "CMYK",
    primer: "Primer",
    inkCostPerUnit: "Ink Cost per Unit",
    downloadPDF: "DOWNLOAD PDF",
    
    // Chart tabs
    payback: "Payback",
    cost: "Cost",
    profit: "Profit",

    // Chart translations
    profitVsSalesVolume: "Profit vs. Sales Volume",
    monthlySalesVolumeUnits: "Monthly Sales Volume (units)",
    monthlyProfitJPY: "Monthly Profit (JPY)",
    profitPerUnit: "Profit per unit",
    volumeLabel: "Volume",
    profitLabel: "Profit",
    
    // Status messages
    excellentInvestment: "Excellent Investment",
    goodInvestment: "Good Investment",
    considerCarefully: "Consider Carefully",
    notProfitable: "Not Profitable",
    excellentPaybackPeriod: "Excellent payback period",
    goodPaybackPeriod: "Good payback period",
    extendedPaybackPeriod: "Extended payback period",
    noProfitWithCurrentParameters: "No profit with current parameters",
    totalCostPerUnit: "Total Cost per Unit",
    costBreakdownPerUnit: "Cost Breakdown per Unit",
    material: "Material",
    ink: "Ink",
    labor: "Labor",
    
    // Units
    currency: "JPY",
    cc: "cc",
    units: "units",
    jobs: "jobs",
    
    // Printer info popover
    printerSpecifications: "MO-180 Printer Specifications",
    baseParameters: "Base Parameters",
    initialInvestment: "Initial Investment",
    printSpeed: "Print Speed",
    printableArea: "Printable Area",
    inkUsageReferenceData: "Ink Usage Reference Data",
    shortEdgeHeader: "Short Edge (mm)",
    whiteInk: "White (cc)",
    cmykInk: "CMYK (cc)",
    primerInk: "Primer (cc)",
    inkUsageFormula: "Ink usage is calculated using a scaling formula: scale = (Short_Edge / 65)²",
    printsPerHour: "prints/hour",
    
    // PDF specific translations
    mo180Simulator: "MO-180 Cost Simulator",
    profitabilityAnalysis: "Profitability Analysis",
    generatedOn: "Generated on",
    keySummary: "Key Summary",
    metric: "Metric",
    value: "Value",
    parameter: "Parameter",
    inkType: "Ink Type",
    volume: "Volume",
    page: "Page",
    of: "of",
    simulationImageCaption: "Simulations are based on the above image",

    // New additions
    inkCostApproximate: "Ink cost is approximate",
    approximateInkCost: "Approximately 3 yen",
    approximatePrefix: "Approximately",
    
    // Edit buttons and actions
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    close: "Close"
  },
  ja: {
    // App title and subtitle
    moSimulatorTitle: "MO-180 コスト計算",
    evaluateProfitability: "Roland DG MO-180 UVプリンターの収益性評価",
    allRightsReserved: "無断複写・転載を禁じます",
    
    // Header
    simulationParameters: "シミュレーションパラメータ",
    printerSpecifications: "プリンター仕様",
    
    // Dimensions section
    productDimensions: "製品寸法",
    shortEdge: "短辺",
    longEdge: "長辺",
    range: "範囲",
    
    // Price section
    priceParameters: "価格パラメータ",
    salesPricePerUnit: "販売単価/個",
    materialCostPerUnit: "材料費原価/個",
    laborCostPerHour: "人件費/時",
    inkPrice: "インク価格",
    
    // Volume section
    monthlySalesVolume: "月間販売量",
    monthlySalesTarget: "月間販売目標",
    unitsPerMonth: "月間販売数量",

    // Results section
    simulationResults: "シミュレーション結果",
    monthlySales: "月間売上",
    monthlyGrossProfit: "月間粗利益",
    grossProfitMargin: "粗利益率",
    investmentPaybackPeriod: "投資回収期間",
    costPerUnit: "一個当たりの原価",
    operatingHours: "稼働時間",
    hours: "時間",
    months: "ヶ月",
    productionDetails: "生産詳細",
    itemsPerPrintJob: "盤面に置ける材料の個数",
    monthlyPrintJobs: "印刷回数",
    inkUsagePerItem: "アイテム当たりのインク使用量",
    white: "ホワイト",
    cmyk: "CMYK",
    primer: "プライマー",
    inkCostPerUnit: "一個当たりのインクコスト",
    downloadPDF: "PDFをダウンロード",
    
    // Chart tabs
    payback: "回収期間",
    cost: "コスト",
    profit: "利益",

    // Chart translations
    profitVsSalesVolume: "利益 vs. 販売量",
    monthlySalesVolumeUnits: "月間販売数量 (個)",
    monthlyProfitJPY: "月間粗利 (円)",
    profitPerUnit: "一個当たりの粗利",
    volumeLabel: "数量",
    profitLabel: "粗利",
    
    // Status messages
    excellentInvestment: "投資効果が非常に高い",
    goodInvestment: "十分な投資効果が期待できる",
    considerCarefully: "導入前に十分な検討をおすすめします",
    notProfitable: "収益性なし",
    excellentPaybackPeriod: "優れた回収期間",
    goodPaybackPeriod: "良好な回収期間",
    extendedPaybackPeriod: "長い回収期間",
    noProfitWithCurrentParameters: "現在のパラメータでは利益なし",
    totalCostPerUnit: "一個当たりの総コスト",
    costBreakdownPerUnit: "一個当たりのコスト内訳",
    material: "材料",
    ink: "インク",
    labor: "人件費",
    
    // Units
    currency: "円",
    cc: "cc",
    units: "個",
    jobs: "回",
    
    // Printer info popover
    printerSpecifications: "MO-180 プリンター仕様",
    baseParameters: "基本パラメータ",
    initialInvestment: "初期投資",
    printSpeed: "印刷速度",
    printableArea: "印刷領域",
    inkUsageReferenceData: "インク使用量参考データ",
    shortEdgeHeader: "短辺 (mm)",
    whiteInk: "ホワイト (cc)",
    cmykInk: "CMYK (cc)",
    primerInk: "プライマー (cc)",
    inkUsageFormula: "インク使用量は次の計算式で算出されます：倍率 = (短辺 / 65)²",
    printsPerHour: "回/時間",
    
    // PDF specific translations
    mo180Simulator: "MO-180 コストシミュレーター",
    profitabilityAnalysis: "収益性分析",
    generatedOn: "作成日",
    keySummary: "重要なサマリー",
    metric: "指標",
    value: "値",
    parameter: "パラメータ",
    inkType: "インクタイプ",
    volume: "容量",
    page: "ページ",
    of: "の",
    simulationImageCaption: "全てのシミュレーションは、この画像を基に算出しています",
    
    // New additions
    inkCostApproximate: "インクコストは概算です",
    approximateInkCost: "約3円",
    approximatePrefix: "約",
    
    // Edit buttons and actions
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    close: "閉じる"
  }
};

export default translations;