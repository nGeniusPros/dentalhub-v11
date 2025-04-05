import React from 'react';

const CallOutcomesChart: React.FC = () => {
  // Sample data for the donut chart
  const data = [
    { name: 'Appointment Scheduled', value: 35, color: '#4BC5BD' },
    { name: 'Call Back Later', value: 25, color: '#6B4C9A' },
    { name: 'Not Interested', value: 15, color: '#C5A572' },
    { name: 'Voicemail', value: 25, color: '#1B2B5B' }
  ];
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate stroke-dasharray and stroke-dashoffset for each segment
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  const segments = data.map(item => {
    const segmentLength = (item.value / total) * circumference;
    const segment = {
      dasharray: `${segmentLength} ${circumference - segmentLength}`,
      dashoffset: -currentOffset,
      color: item.color,
      name: item.name,
      value: item.value,
      percentage: Math.round((item.value / total) * 100)
    };
    currentOffset += segmentLength;
    return segment;
  });

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <circle 
              key={`segment-${index}`}
              cx="50" 
              cy="50" 
              r={radius} 
              fill="transparent" 
              stroke={segment.color} 
              strokeWidth="20" 
              strokeDasharray={segment.dasharray} 
              strokeDashoffset={segment.dashoffset} 
              transform="rotate(-90 50 50)"
            />
          ))}
          <circle cx="50" cy="50" r="30" fill="white" />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
        {segments.map((segment, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
            <span className="text-xs text-gray-600">{segment.name} ({segment.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallOutcomesChart;
