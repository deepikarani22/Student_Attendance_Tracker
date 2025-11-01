import React from "react";

function SubWise({ attd }) {
  return (
    <div className="card-glass p-4 rounded-2xl shadow-soft-lg">
      <h3 className="text-sm font-semibold mb-1">Subject wise attendance</h3>
      <div className="text-2xl font-bold">{attd.p}%</div>
    </div>
  );
}

export default SubWise;


/*function SubWise({attd}){
    return (
    <div>
        <h2>Subject wise attendance</h2>
        <h1>{attd.p} %</h1>
    </div>
    );
}
export default SubWise;*/