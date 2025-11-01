import React from "react";
import SideBar from "../components/SideBar.jsx";
import OverallInfoCard from "../components/StdCard.jsx";
import AttdPrecentage from "../components/Percentage.jsx";
import WeeklyProgress from "../components/Weekly.jsx";
import DayWise from "../components/DayWaise.jsx";
import SubWise from "../components/SubWise.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import DashboardCalendar from '../components/Calendar/Calendar';

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="w-72">
            <SideBar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Hi, Dilan</h1>
                <p className="text-sm text-gray-500">Welcome back — here’s your summary.</p>
              </div>

              <div className="flex items-center gap-4">
                <SearchBar />
                <NotificationIcon />
              </div>
            </div>

            {/* dashboard grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* overall info (3 cols) */}
              <div className="bg-gray-900 p-5 rounded-2xl shadow-lg col-span-4">
                <OverallInfoCard attd={{ presentDays: 28, totalDays: 30 }} />
              </div>

              {/* weekly progress (5 cols) */}
              <div className="col-span-5">
                <WeeklyProgress attd={{ p: 72 }} />
              </div>

              {/* month progress (3 cols) */}
              <div className="col-span-3">
                <AttdPrecentage attd={{ p: 92 }} />
              </div>

              {/* lower row: goals + tasks */}
              <div className="card-glass rounded-2xl p-6 shadow-soft-lg">
                  <div>
                    <DashboardCalendar />
                  </div>
              </div>

              <div className="col-span-4">
                <div className="card-glass rounded-2xl p-6 shadow-soft-lg">
                  <h3 className="text-lg font-semibold mb-3">Task in process</h3>
                  <div className="space-y-3">
                    <div className="bg-white/6 p-4 rounded-xl hover:translate-y-[-4px] transition">
                      <div className="text-sm font-medium">Buy Susan a gift</div>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                    <div className="bg-white/6 p-4 rounded-xl hover:translate-y-[-4px] transition">
                      <div className="text-sm font-medium">Doctor's appointment</div>
                      <p className="text-xs text-gray-400">02.09.2025</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <div className="card-glass rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Add task</h3>
                    <p className="text-sm text-gray-400 mt-2">Quick add or click to create new items</p>
                  </div>
                  <button className="mt-4 bg-white/6 hover:bg-white/10 text-white py-2 rounded-lg">+ Add task</button>
                </div>
              </div>

              {/* bottom row: last projects */}
              <div className="col-span-12">
                <h3 className="text-lg font-semibold mb-3">Last Projects</h3>
                <div className="flex gap-4">
                  <div className="flex-1 card-glass p-5 rounded-2xl hover:shadow-lg transition">New Schedule — In progress</div>
                  <div className="flex-1 card-glass p-5 rounded-2xl hover:shadow-lg transition">Prototype animation — Completed</div>
                  <div className="flex-1 card-glass p-5 rounded-2xl hover:shadow-lg transition">AI Project 2 — In progress</div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;


/*import React, { useState } from 'react';
import OverallInfoCard from '../components/StdCard.jsx';
import AttdPrecentage from '../components/Percentage.jsx';
import WeeklyProgress from '../components/Weekly.jsx';
import DayWise from '../components/DayWaise.jsx';
import SubWise from '../components/SubWise.jsx';
import SideBar from '../components/SideBar.jsx';
import SearchBar from '../components/SearchBar.jsx';


function StudentDashboard() {
  return (
    <>
      <OverallInfoCard attd={{presentDays : 22, totalDays:35}}/>
      <AttdPrecentage attd={{p:95}}/>
      <WeeklyProgress attd={{p:77}}/>
      <DayWise attd={{p:77}}/>
      <SubWise attd={{p:77}}/>
      <SideBar/>
      <SearchBar/>
    </>
  );
}
export default StudentDashboard;*/