import React from 'react';

const BestTimeChart: React.FC = () => {
  // Sample data for the bar chart
  const timeData = [
    { time: '8am', calls: 25 },
    { time: '10am', calls: 45 },
    { time: '12pm', calls: 35 },
    { time: '2pm', calls: 50 },
    { time: '4pm', calls: 40 },
    { time: '6pm', calls: 30 }
  ];
  
  // Find the maximum value for scaling
  const maxCalls = Math.max(...timeData.map(item => item.calls));
  
  return (
    <div className="h-full w-full">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end">
          <div className="w-full h-full flex items-end justify-around px-4">
            {timeData.map((item, index) => {
              const height = (item.calls / maxCalls) * 100;
              return (
                <div key={`bar-${index}`} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-navy rounded-t-md transition-all duration-300 hover:bg-blue-700"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: '#1B2B5B' 
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="h-8 flex justify-around px-4">
          {timeData.map((item, index) => (
            <div key={`label-${index}`} className="text-xs text-gray-600 text-center">
              {item.time}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestTimeChart;
