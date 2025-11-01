import React from "react";

function OverallInfoCard({ attd = { presentDays: 0, totalDays: 0 } }) {
  return (
    <div className="card-glass bg-gray-900 text-gray-100 p-6 rounded-2xl shadow-soft-lg">
      <div className="card-glass-dark flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Overall Information</h3>
          <p className="text-sm text-gray-400">Summary of attendance</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center shadow-md hover:scale-105 transition">
            <div className="text-lg font-bold text-gray-900">{attd.presentDays}</div>
            <p className="text-xs text-gray-500">Attended</p>
          </div>

          <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center shadow-md hover:scale-105 transition">
            <div className="text-lg font-bold text-gray-900">{attd.totalDays}</div>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverallInfoCard;


/*import React, { useState } from 'react';

function OverallInfoCard({attd}){
    return (
    /*<div>
        <h2>Overall Information</h2>
        <div className="presentDays">
            <div className="presentNo">{attd.presentDays}</div>
            <p className="presentText">Present</p>
        </div>
        <div className="totalDays">
            <div className="totalNo">{attd.totalDays}</div>
            <p className="totalText">Present</p>
        </div>
    </div>
    <div className="bg-gray-900 text-black p-10 rounded-2xl w-72 shadow-xl">
        <div className="grid grid-cols-3 gap-3">
        <div className="bg-white text-black-900 p-3 rounded-xl flex flex-col items-center justify-center shadow-md">
          <div className="text-lg font-bold">28</div>
          <p className="text-xs text-gray-500">Attended</p>
        </div>

        <div className="bg-white text-black-900 p-3 rounded-xl flex flex-col items-center justify-center shadow-md">
          <div className="text-lg font-bold">30</div>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
    </div>
    );
}
export default OverallInfoCard;*/