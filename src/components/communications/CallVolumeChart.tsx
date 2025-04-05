import React from 'react';

const CallVolumeChart: React.FC = () => {
  // Sample data for the chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="h-full w-full">
      {/* Simulated chart with SVG */}
      <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
        {/* Background grid */}
        <g className="grid">
          {[0, 1, 2, 3, 4].map((i) => (
            <line 
              key={`grid-h-${i}`}
              x1="0" 
              y1={60 * i + 30} 
              x2="800" 
              y2={60 * i + 30} 
              stroke="#e5e7eb" 
              strokeWidth="1"
            />
          ))}
          {days.map((_, i) => (
            <line 
              key={`grid-v-${i}`}
              x1={i * (800 / 7) + (800 / 14)} 
              y1="0" 
              x2={i * (800 / 7) + (800 / 14)} 
              y2="300" 
              stroke="#e5e7eb" 
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Purple area */}
        <path 
          d="M0,150 C50,120 100,180 150,140 C200,100 250,160 300,130 C350,100 400,120 450,110 C500,100 550,130 600,120 C650,110 700,140 750,130 C800,120 800,300 0,300 Z" 
          fill="#9333ea" 
          fillOpacity="0.3"
        />
        
        {/* Blue area */}
        <path 
          d="M0,170 C50,160 100,190 150,170 C200,150 250,180 300,160 C350,140 400,150 450,140 C500,130 550,160 600,150 C650,140 700,170 750,160 C800,150 800,300 0,300 Z" 
          fill="#3b82f6" 
          fillOpacity="0.3"
        />
        
        {/* Green area */}
        <path 
          d="M0,180 C50,175 100,185 150,180 C200,175 250,185 300,180 C350,175 400,180 450,175 C500,170 550,180 600,175 C650,170 700,180 750,175 C800,170 800,300 0,300 Z" 
          fill="#10b981" 
          fillOpacity="0.3"
        />
        
        {/* Purple line */}
        <path 
          d="M0,150 C50,120 100,180 150,140 C200,100 250,160 300,130 C350,100 400,120 450,110 C500,100 550,130 600,120 C650,110 700,140 750,130 C800,120" 
          fill="none" 
          stroke="#9333ea" 
          strokeWidth="3"
        />
        
        {/* Blue line */}
        <path 
          d="M0,170 C50,160 100,190 150,170 C200,150 250,180 300,160 C350,140 400,150 450,140 C500,130 550,160 600,150 C650,140 700,170 750,160 C800,150" 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="3"
        />
        
        {/* Green line */}
        <path 
          d="M0,180 C50,175 100,185 150,180 C200,175 250,185 300,180 C350,175 400,180 450,175 C500,170 550,180 600,175 C650,170 700,180 750,175 C800,170" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="3"
        />
        
        {/* X-axis labels */}
        {days.map((day, i) => (
          <text 
            key={`label-${day}`}
            x={i * (800 / 7) + (800 / 14)} 
            y="295" 
            textAnchor="middle" 
            fontSize="12" 
            fill="#6b7280"
          >
            {day}
          </text>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Attempted</span>
        </div>
      </div>
    </div>
  );
};

export default CallVolumeChart;
