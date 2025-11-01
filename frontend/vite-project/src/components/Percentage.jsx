import React from "react";

function AttdPrecentage({ attd }) {
  return (
    <div className="card-glass p-6 rounded-2xl shadow-soft-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Month progress</h3>
      <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white/6">
        <div className="text-2xl font-bold">{attd.p}%</div>
      </div>
    </div>
  );
}

export default AttdPrecentage;


/*function AttdPrecentage({attd}){
    return (
    <div>
        <h2>Percentage</h2>
        <h1>{attd.p} %</h1>
    </div>
    );
}
export default AttdPrecentage;*/