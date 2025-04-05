import React from 'react';

const CampaignPerformanceChart: React.FC = () => {
  // Sample data for the line chart
  const campaignData = [
    { name: 'Recall', success: 85, response: 65 },
    { name: 'Reactivation', success: 75, response: 55 },
    { name: 'Appointment', success: 90, response: 70 },
    { name: 'Treatment', success: 80, response: 60 },
    { name: 'Event', success: 70, response: 50 }
  ];
  
  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  // Find the maximum value for scaling
  const maxValue = Math.max(
    ...campaignData.map(item => Math.max(item.success, item.response))
  );
  
  // Calculate positions for the lines
  const successPoints = campaignData.map((item, index) => {
    const x = padding + (index * (chartWidth / (campaignData.length - 1)));
    const y = height - padding - ((item.success / 100) * chartHeight);
    return `${x},${y}`;
  }).join(' ');
  
  const responsePoints = campaignData.map((item, index) => {
    const x = padding + (index * (chartWidth / (campaignData.length - 1)));
    const y = height - padding - ((item.response / 100) * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Background grid */}
        <g className="grid">
          {[0, 25, 50, 75, 100].map((value, i) => (
            <g key={`grid-${i}`}>
              <line 
                x1={padding} 
                y1={height - padding - ((value / 100) * chartHeight)} 
                x2={width - padding} 
                y2={height - padding - ((value / 100) * chartHeight)} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              <text 
                x={padding - 5} 
                y={height - padding - ((value / 100) * chartHeight)} 
                textAnchor="end" 
                dominantBaseline="middle" 
                fontSize="10" 
                fill="#6b7280"
              >
                {value}%
              </text>
            </g>
          ))}
          
          {campaignData.map((item, i) => (
            <g key={`label-${i}`}>
              <line 
                x1={padding + (i * (chartWidth / (campaignData.length - 1)))} 
                y1={padding} 
                x2={padding + (i * (chartWidth / (campaignData.length - 1)))} 
                y2={height - padding} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              <text 
                x={padding + (i * (chartWidth / (campaignData.length - 1)))} 
                y={height - padding + 15} 
                textAnchor="middle" 
                fontSize="10" 
                fill="#6b7280"
              >
                {item.name}
              </text>
            </g>
          ))}
        </g>
        
        {/* Success rate line */}
        <polyline 
          points={successPoints} 
          fill="none" 
          stroke="#4BC5BD" 
          strokeWidth="2"
        />
        
        {/* Success rate points */}
        {campaignData.map((item, i) => (
          <circle 
            key={`success-point-${i}`}
            cx={padding + (i * (chartWidth / (campaignData.length - 1)))} 
            cy={height - padding - ((item.success / 100) * chartHeight)} 
            r="4" 
            fill="#4BC5BD"
          />
        ))}
        
        {/* Response rate line */}
        <polyline 
          points={responsePoints} 
          fill="none" 
          stroke="#6B4C9A" 
          strokeWidth="2"
        />
        
        {/* Response rate points */}
        {campaignData.map((item, i) => (
          <circle 
            key={`response-point-${i}`}
            cx={padding + (i * (chartWidth / (campaignData.length - 1)))} 
            cy={height - padding - ((item.response / 100) * chartHeight)} 
            r="4" 
            fill="#6B4C9A"
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#4BC5BD' }}></div>
          <span className="text-xs text-gray-600">Success Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#6B4C9A' }}></div>
          <span className="text-xs text-gray-600">Response Rate</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignPerformanceChart;
