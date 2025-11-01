import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardCalendar({ studentId }) {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [leaveDates, setLeaveDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveDates = async () => {
      if (!user || user.role !== 'student') {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/student/${user.id}/leaves`);
        setLeaveDates(response.data || []);
      } catch (error) {
        console.error('Error fetching leave dates:', error);
        setLeaveDates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveDates();
  }, [user]);

  // Convert leave dates to a Set for quick lookup
  const leaveDateSet = new Set(
    leaveDates.map(leave => {
      const date = new Date(leave.date);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  );

  // Custom tile content to highlight leave dates
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (leaveDateSet.has(dateKey)) {
        return (
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  // Custom className for leave dates
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (leaveDateSet.has(dateKey)) {
        return 'leave-date-highlight';
      }
    }
    return null;
  };

  return (
    <div className="w-full">
      <h2 className="text-white text-xl font-semibold mb-4 text-center">Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        className="react-calendar-custom w-full rounded-2xl overflow-hidden"
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
      <p className="text-gray-300 mt-4 text-center text-sm">
        Selected: {date.toDateString()}
      </p>
      {leaveDates.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-300 text-xs">Leave dates</span>
        </div>
      )}
    </div>
  );
}
