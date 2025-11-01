import React from "react";

function WeeklyProgress({ attd }) {
  // simple sparkline SVG placeholder
  return (
    <div className="card-glass p-6 rounded-2xl shadow-soft-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Weekly progress</h3>
        <div className="text-sm text-gray-400">{attd.p}%</div>
      </div>

      <svg className="w-full h-28" viewBox="0 0 200 60" preserveAspectRatio="none">
        <polyline
          points="0,40 20,30 40,35 60,20 80,25 100,10 120,18 140,28 160,16 180,24 200,12"
          fill="none"
          stroke="white"
          strokeOpacity="0.8"
          strokeWidth="2"
        />
      </svg>

      <div className="flex justify-between text-xs text-gray-400 mt-3">
        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
      </div>
    </div>
  );
}

export default WeeklyProgress;


/*function WeeklyProgress({attd}){
    return (
    <div>
        <h2>Weekly Progress</h2>
        <h1>{attd.p} %</h1>
    </div>
    );
}
export default WeeklyProgress;*/