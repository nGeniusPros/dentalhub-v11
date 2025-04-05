// Chart styling configuration for consistent chart appearance
export const chartColors = {
  navy: {
    DEFAULT: '#1B2B5B',
    light: '#2A407F',
    lighter: '#3855A3',
    opacity: 'rgba(27, 43, 91, 0.7)',
    ultraLight: 'rgba(27, 43, 91, 0.1)'
  },
  gold: {
    DEFAULT: '#C5A572',
    light: '#D4BC94',
    lighter: '#E3D3B6',
    opacity: 'rgba(197, 165, 114, 0.7)',
    ultraLight: 'rgba(197, 165, 114, 0.1)'
  },
  blue: {
    DEFAULT: '#7D9BB9',
    soft: '#9BB4CA',
    lighter: '#B9CDDB',
    opacity: 'rgba(125, 155, 185, 0.7)',
    ultraLight: 'rgba(125, 155, 185, 0.1)'
  },
  turquoise: {
    DEFAULT: '#4BC5BD',
    light: '#76D4CE',
    lighter: '#A1E3DF',
    opacity: 'rgba(75, 197, 189, 0.7)',
    ultraLight: 'rgba(75, 197, 189, 0.1)'
  },
  purple: {
    DEFAULT: '#6B4C9A',
    light: '#8A6FB3',
    lighter: '#A992CC',
    opacity: 'rgba(107, 76, 154, 0.7)',
    ultraLight: 'rgba(107, 76, 154, 0.1)'
  },
  green: {
    DEFAULT: '#41B38A',
    light: '#6BC4A4',
    lighter: '#95D5BE',
    opacity: 'rgba(65, 179, 138, 0.7)',
    ultraLight: 'rgba(65, 179, 138, 0.1)'
  }
};

// Color sequence for charts with multiple data series
export const chartColorSequence = [
  chartColors.navy.DEFAULT,
  chartColors.gold.DEFAULT,
  chartColors.turquoise.DEFAULT,
  chartColors.purple.DEFAULT,
  chartColors.green.DEFAULT,
  chartColors.blue.DEFAULT,
  chartColors.navy.light,
  chartColors.gold.light,
  chartColors.turquoise.light,
  chartColors.purple.light
];

// Chart configuration for consistent styling
export const chartConfig = {
  lineChart: {
    strokeWidth: 2,
    dotRadius: 4,
    activeDotRadius: 6,
    gridStrokeDasharray: '3 3',
    gridStrokeOpacity: 0.3
  },
  barChart: {
    barSize: 30,
    cornerRadius: 4
  },
  pieChart: {
    innerRadius: 60,
    outerRadius: 80,
    paddingAngle: 2,
    labelLine: false
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #E9ECEF',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '8px 12px'
    }
  }
};

// Sample data for charts
export const sampleChartData = {
  lineData: [
    { month: 'Jan', revenue: 12000, patients: 120 },
    { month: 'Feb', revenue: 15000, patients: 140 },
    { month: 'Mar', revenue: 18000, patients: 160 },
    { month: 'Apr', revenue: 16000, patients: 150 },
    { month: 'May', revenue: 21000, patients: 180 },
    { month: 'Jun', revenue: 19000, patients: 170 }
  ],
  barData: [
    { category: 'Cleanings', completed: 45, scheduled: 20 },
    { category: 'Fillings', completed: 35, scheduled: 15 },
    { category: 'Crowns', completed: 25, scheduled: 10 },
    { category: 'Root Canals', completed: 15, scheduled: 5 },
    { category: 'Extractions', completed: 10, scheduled: 8 }
  ],
  pieData: [
    { name: 'New Patients', value: 30, color: chartColors.navy.DEFAULT },
    { name: 'Returning', value: 45, color: chartColors.gold.DEFAULT },
    { name: 'Referrals', value: 25, color: chartColors.turquoise.DEFAULT }
  ]
};
